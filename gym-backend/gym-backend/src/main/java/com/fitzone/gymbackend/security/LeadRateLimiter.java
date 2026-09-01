package com.fitzone.gymbackend.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LeadRateLimiter {

	private static final int MAX_SUBMISSIONS = 10;
	private static final long WINDOW_MS = 60 * 60 * 1000L; // 1 hour

	private static final class Bucket {
		final AtomicInteger count = new AtomicInteger(0);
		volatile long windowStart = Instant.now().toEpochMilli();
	}

	private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

	public boolean tryAcquire(String clientIp) {
		Bucket bucket = buckets.computeIfAbsent(clientIp, k -> new Bucket());
		long now = Instant.now().toEpochMilli();
		if (now - bucket.windowStart > WINDOW_MS) {
			bucket.windowStart = now;
			bucket.count.set(0);
		}
		return bucket.count.incrementAndGet() <= MAX_SUBMISSIONS;
	}
}