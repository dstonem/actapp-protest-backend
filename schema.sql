create table users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE not null,
    password VARCHAR(100) not null,
    firstName text not null,
    lastName text not null,
    email VARCHAR UNIQUE not null,
    streetaddress VARCHAR not null,
    city VARCHAR not null,
    state VARCHAR not null,
    zipcode VARCHAR not null,
    profilePic VARCHAR,
    cause_one TEXT,
    cause_two TEXT,
    cause_three TEXT
);
-- PROBABLY CHANGE THE START AND END TIMES TO STRINGS, DATES TOO UNLESS I CAN PULL IT OUT OF THE DATABASE AND CHANGE IT TO THE RIGHT FORMAT (2020-11-3 looks weird)
create table events (
    id SERIAL PRIMARY KEY,
    pic text,
    description VARCHAR not null,
    startTime time (0) not null,
    endTime time (0) not null,
    eventDate date not null,
    location VARCHAR not null,
    cause VARCHAR,
    policies VARCHAR,
    policy_descriptions VARCHAR,
    event_url VARCHAR,
    organizer VARCHAR references users (username)
);

-- may add the event pic and the event url so we can make one db query to retrieve everything we need
-- to display on the user's profile page
create table attendees (
    user_id integer references users (id),
    event_id integer references events (id)
);

create table archivedEvents (
    id integer references events (id),
    pic text,
    description VARCHAR not null,
    startTime time (0) not null,
    endTime time (0) not null,
    eventDate date not null,
    location VARCHAR not null,
    cause VARCHAR,
    policies VARCHAR,
    policy_descriptions VARCHAR,
    event_url VARCHAR,
    organizer VARCHAR references users (username)
) partition by range (eventDate);

create table archivedEvents_2020 partition of archivedEvents
    for values from ('2020-01-01') to ('2020-12-31');

create table archivedEvents_2021 partition of archivedEvents
    for values from ('2021-01-01') to ('2021-12-31');

create table policies (
    id serial primary key,
    username varchar(16) references users (username),
    title varchar(150) not null,
    description varchar not null,
    dateProposed date not null,
    -- not sure if this one needs to be in reference to this in the events table
    event_id integer references events (id)
);

create table policySupport (
    username varchar(16) references users (username),
    policy_id integer references policies (id),
    whySupport varchar
);

insert into users (username,password,firstName,lastName,email,streetaddress,city,state,zipcode,cause_one,cause_two,cause_three)

values 
    ('dstonem','123456','dylan','stone-miller','dstonemiller@gmail.com', '1234 Marsh Trail Circle', 'Sandy Springs', 'Georgia', '29307','blm','election','climate'),
    ('npatton','123456','nathan','patton','npatton@gmail.com', '1234 Ashford Road', 'Atlanta', 'Georgia', '22236','blm','election','climate'),
    ('fgarcia','123456','frida','garcia','fgar@gmail.com', '1234 Ashford Road', 'Atlanta', 'Georgia', '22236','blm','election','climate')
;

insert into events (pic, description, location, startTime, endTime, eventDate, cause, policies, policy_descriptions, event_url, organizer)

values 
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'blm','policy title','policy description','/event1', 'dstonem'),
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'climate','policy title','policy description','/event2', 'npatton'),
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'election','policy title','policy description','/event3', 'fgarcia')
;

insert into archivedEvents (pic, description, location, startTime, endTime, eventDate, cause, policies, policy_descriptions, event_url, organizer)

values 
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'blm','policy title','policy description','/event1', 'dstonem'),
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'climate','policy title','policy description','/event2', 'npatton'),
    ('/images/voting_selfie.jpg','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'election','policy title','policy description','/event3', 'fgarcia')
;

insert into attendees (user_id,event_id)

VALUES
    (1,1),
    (2,1),
    (3,1),
    (1,2),
    (1,3),
    (2,3),
    (3,3)
;