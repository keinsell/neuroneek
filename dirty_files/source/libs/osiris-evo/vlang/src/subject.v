module main

struct Subject {
	username string
}

pub fn (s Subject) get_username() string {
	println('Reading username')
	return s.username
}

pub fn subject_create(username string) Subject {
	println('Creating subject with username: ${username}')
	return Subject{
		username: username
	}
}
