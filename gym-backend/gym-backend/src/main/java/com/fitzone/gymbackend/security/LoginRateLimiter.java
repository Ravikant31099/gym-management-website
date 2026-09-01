package com.fitzone.gymbackend.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LoginRateLimiter {

	private static final int MAX_ATTEMPTS = 5;
	private static final long WINDOW_MS = 15 * 60 * 1000L; // 15 minutes
	private static final long BLOCK_MS = 15 * 60 * 1000L; // 15 minutes lockout once tripped

	private static final class Bucket {
		final AtomicInteger attempts = new AtomicInteger(0);
		volatile long windowStart = Instant.now().toEpochMilli();
		volatile long blockedUntil = 0L;
	}

	private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

	public boolean isBlocked(String key) {
		Bucket bucket = buckets.get(key);
		if (bucket == null) {
			return false;
		}
		return Instant.now().toEpochMilli() < bucket.blockedUntil;
	}

	public void recordFailure(String key) {
		Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket());
		long now = Instant.now().toEpochMilli();
		if (now - bucket.windowStart > WINDOW_MS) {
			bucket.windowStart = now;
			bucket.attempts.set(0);
		}
		int count = bucket.attempts.incrementAndGet();
		if (count >= MAX_ATTEMPTS) {
			bucket.blockedUntil = now + BLOCK_MS;
		}
	}

	public void recordSuccess(String key) {
		buckets.remove(key);
	}

	public long remainingBlockSeconds(String key) {
		Bucket bucket = buckets.get(key);
		if (bucket == null) {
			return 0;
		}
		long remainingMs = bucket.blockedUntil - Instant.now().toEpochMilli();
		return Math.max(0, remainingMs / 1000);
	}
}