setup:
	npm i
	mkdir -p ./db
	mkdir -p ./public/static/files
	touch images.db
	sqlite3 /db/images.db ".read 01_migratin.sql"

migrate:
	if test -f db/images.db; then rm db/images.db; fi;
	touch db/images.db
	sqlite3 db/images.db ".read db/01_migration.sql"

clean:
	# find public/static/files/ -maxdepth 5 -type f -delete
	rm -rf ./public/static/files
	mkdir ./public/static/files

postLogin:
	curl -X POST http://localhost:8871/signin -c cookie-file.txt -H 'Content-Type: application/json' -d '{"username":"user1", "password":"password1"}'
