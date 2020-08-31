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
    points integer,
    firstTimeUser boolean default true,
    cause_one TEXT,
    cause_two TEXT,
    cause_three TEXT
);
-- PROBABLY CHANGE THE START AND END TIMES TO STRINGS, DATES TOO UNLESS I CAN PULL IT OUT OF THE DATABASE AND CHANGE IT TO THE RIGHT FORMAT (2020-11-3 looks weird)
create table events (
    id SERIAL PRIMARY KEY,
    pic text,
    title VARCHAR(100),
    description VARCHAR not null,
    startTime time (0) not null,
    endTime time (0) not null,
    eventDate date not null,
    location VARCHAR not null,
    cause VARCHAR,
    policies text ARRAY,
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
    title VARCHAR(100),
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
    organizer varchar(16) references users (username),
    title varchar(150) not null,
    cause varchar not null,
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

create table posts (
    id SERIAL PRIMARY KEY,
    picurl text not null,
    body VARCHAR not null,
    causes VARCHAR,
    post_url VARCHAR,
    user_id integer references users (id),
    username VARCHAR references users (username),
    event_id integer references events (id)
);

create table likes (
    user_id integer references users (id),
    post_id integer references posts (id)
);

create table comments (
    id serial primary key,
    comment text not null,
    created_at timestamp default now(),
    post_id integer references posts (id),
    user_id integer references users (id),
    username text REFERENCES users (username)
);

create table tags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR
);

create table tags_posts (
    tag_id VARCHAR,
    post_id VARCHAR
);

insert into users (username,password,firstName,lastName,email,streetaddress,city,state,zipcode,points,cause_one,cause_two,cause_three)

values 
    ('dstonem','123456','dylan','stone-miller','dstonemiller@gmail.com', '1234 Marsh Trail Circle', 'Sandy Springs', 'Georgia', '29307',25,'blm','election','climate'),
    ('npatton','123456','nathan','patton','npatton@gmail.com', '1234 Ashford Road', 'Atlanta', 'Georgia', '22236',25,'blm','election','climate'),
    ('fgarcia','123456','frida','garcia','fgar@gmail.com', '1234 Ashford Road', 'Atlanta', 'Georgia', '22236',25,'blm','election','climate')
;

insert into events (pic, title, description, location, startTime, endTime, eventDate, cause, policies, policy_descriptions, event_url, organizer)

values 
    ('fire.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'blm','{policy title:policy decription,policy title 2}','policy description','/event1', 'dstonem'),
    ('fist.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'climate','{policy title,policy title 2}','policy description','/event2', 'npatton'),
    ('IMG_5011.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'election','{policy title,policy title 2}','policy description','/event3', 'fgarcia')
;

insert into archivedEvents (pic, title, description, location, startTime, endTime, eventDate, cause, policies, policy_descriptions, event_url, organizer)

values 
    ('/images/voting_selfie.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'blm','policy title','policy description','/event1', 'dstonem'),
    ('/images/voting_selfie.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'climate','policy title','policy description','/event2', 'npatton'),
    ('/images/voting_selfie.jpg','March for Breonna Taylor','event description', '300 MLK Jr Dr Atlanta, GA 30303', '09:00:00', '10:00:00', '2020-11-03', 'election','policy title','policy description','/event3', 'fgarcia')
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

insert into policies (organizer, title, cause, description, dateProposed, event_id)

VALUES
    ('dstonem','Augmented Training for Police Officers','blm','Police officers should be required to receive at least 1000 hours of training from training programs reviewed by a committee of veteran police officers with good records to be approved for large government contracts to continue training.','2020-11-03',1),
    ('dstonem','End Qualified Immunity','blm','Arrest those MFers','2020-11-03',1),
    ('dstonem','End Qualified Immunity','blm','Arrest those MFers','2020-11-03',2)
;

insert into policySupport (username,policy_id,whySupport)

VALUES
    ('dstonem',1,''),
    ('dstonem',2,'Because its important'),
    ('npatton',2,'')
;

insert into posts (picurl,body,causes,post_url,user_id,username,event_id) 
values
    ('/images/1596488320842IMG_5855.jpg','Receipt from Le Petit Marche in Kirkwood','blm','post1',1,'dstonem',1),
    ('/images/1596048324660goveri_logotype2shadow (1).png','Built an app prototype to collect data on how best to support sustained activism','blm','post2',1,'dstonem',2),
    ('/images/1596551175118IMG_5011.JPG','Grew my own pumpkin for Halloween this year!','climate','post3',1,'dstonem',1),
    
    ('/images/1596316748869k-mitch-hodge-LBFZfZp7sq4-unsplash.jpg','Built this building using sustainable materials','climate','post4',2,'npatton',2),
    ('/images/1596488320842IMG_5855.jpg','I love Le Petit Marche!','blm','post5',2,'npatton',1),
    ('/images/1596515189903patrick-hendry--AbeoL252z0-unsplash.jpg','Started cooking with my own biofuel made from compost tea! Come enjoy a yard-to-table meal cooked with sustainable fuel!','climate','post6',2,'npatton',3),
    
    ('/images/voting_selfie.jpg','I voted early!','election','post7',3,'fgarcia',1),
    ('/images/cooking_with_stasher.png','I just bought these sustainable silicone baggies and I found out you can COOK things in them!','climate','post8',3,'fgarcia',3),
    ('/images/hugh_hunter_class.png','Just signed up for this professional development course! Supporting a black entrepreneur!','blm','post9',3,'fgarcia',3)
;

insert into likes (user_id, post_id)
values
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (2, 6);

insert into comments (comment,post_id,user_id,username)
VALUES
    ('Nice! Love that place',1,2,'npatton'),
    ('Nice one!',4,1,'dstonem');