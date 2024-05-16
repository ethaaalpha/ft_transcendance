import os, sys

env_key = ['DOMAIN', 
		   'DB_PASSWORD', 'DB_USER', 'DB_NAME', 
		   'API_CALLBACK', 'API_URL', 'API_UUID', 'API_SECRET', 'API_TOKEN', 'API_INFO', 
		   'EMAIL_HOST_USER', 'EMAIL_HOST_PASSWORD', 
		   'SECRET_KEY', 
		   'NODE1_ACCOUNT_PASSWORD', 'NODE2_ACCOUNT_PASSWORD', 'NETWORK_ID']

def create(path):
	with open(path, 'w') as f:
		for key in env_key:
			f.write(f"{key}=\n")

def check(path):
	env_status = {}

	with open(path, 'r') as f:
		for line in f:
			if (line[0] == '#' or line[0] == '\n'):
				continue
			where = line.find('=')
			if not where:
				return
			key = line[0:where].strip()
			value = line[where+1:].strip()
			env_status[key] = bool(value)

	for key in env_key:
		if key not in env_status or not env_status[key]:
			return (0)
	return (1)

def fill(path):
	try:
		env_values = {}

		for key in env_key:
			value = ''
			while (not bool(value.strip())):
				value = input(f'Enter value for {key}: ')
				  
			env_values[key] = value

		with open(path, 'w') as f:
			for key, value in env_values.items():
				f.write(f"{key}={value}\n")
		
		print("Filling env file successfully finished !")
		return (0)
	
	except:
		print(f'Something bad happend !', file=sys.stderr)
	return (1)

def ask():
	try:
		res = input("Would you like to fill the env file with CLI ? (y/n) ")
		if (res.strip() == 'y'):
			return (1)
		return (0)
	except Exception as e:
		print(f'Something bad happend !', file=sys.stderr)
	return (0)	

def main():
	if (len(sys.argv) < 2):
		return (1)
	
	path = sys.argv[1]

	if not (os.path.exists(path)):
		print('Env file do not exist !')
		create(path)
		print('Env file successfully created !')
		if (ask()):
			return (fill(path))
		return (1)
	else:
		if (check(path)):
			print('Correct file .env file !')
			return (0)
		print('Incorrect .env file, missing values !')
		return (1)


if __name__ == "__main__":
    sys.exit(main())
