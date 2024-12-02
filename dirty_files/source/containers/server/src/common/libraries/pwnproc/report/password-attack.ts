export enum PasswordAttack
  {
	 /** online attack on a service that rate-limits password auth attempts. */
	 ONLINE_THROTTLING_100_PER_HOUR       = 'online_throttling_100_per_hour',
	 /**   # online attack on a service that doesn't rate-limit, or where an attacker has outsmarted rate-limiting. */
	 ONLINE_NO_THROTTLING_10_PER_SECOND   = 'online_no_throttling_10_per_second',
	 OFFLINE_SLOW_HASHING_1E4_PER_SECOND  = 'offline_slow_hashing_1e4_per_second',
	 OFFLINE_FAST_HASHING_1E10_PER_SECOND = 'offline_fast_hashing_1e10_per_second',
  }