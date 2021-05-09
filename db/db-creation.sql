create table if not exists User_Account (
	user_id uuid default gen_random_uuid(),
	user_email text unique not null ,
	user_password text not null,
	password_salt text not null,
	first_name text not null,
	last_name text not null,
	primary key (user_id)
);

create table if not exists Priority (
	priority_id int not null,
	priority_value text not null,
	primary key(priority_id)
);

create table if not exists To_Do (
	todo_id uuid default gen_random_uuid(),
	user_id uuid not null,
	todo_start_date timestamptz not null,
	todo_end_date timestamptz not null,
	title text not null,
	priority_id int,
	is_done boolean default false,
	is_cancelled boolean default false,
	primary key (todo_id),
	constraint fk_user
		foreign key (user_id)
		references User_Account (user_id)
		on delete cascade,
	constraint fk_priority
		foreign key (priority_id)
		references Priority(priority_id)
		on delete set null
);

create table if not exists Todo_Task (
	subscription_id uuid default gen_random_uuid(),
	endpoint text unique not null,
	user_id text not null,
	p256dh_key text not null,
	auth_key text not null,
	primary key (subscription_id),
	constraint fk_user
		foreign key (user_id)
		references User_Account(user_id)
		on delete cascade
)

insert into Priority(priority_id, priority_value) values (1, 'HIGH'), (2, 'MODERATE'), (3, 'LOW')
