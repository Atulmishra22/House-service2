# House Service v2
Multi User Platform: Admin, Professional and customer. <br>
user can create account, book service, book professional.<br>
it send sheduled mail to professional if any request is accepeted and time to do service.<br>
if any new service is assigned.


#### Admin :
1. admin can generate service
2. manage users- professional and customer
3. Get the closed service request data in the form of csv.
#### customer :
1. book service professional directly based on their service.
2. book service 
3. search service by service name , address and pincode
4. close the service request or cancel.

#### Professional :
1. accept and rject service request which is directly assigned to it.
2. accept the service request which is available for all the user. 

## Installation

```python 
pip install -r requirement.txt

```
it install all  the requirement in python to run the app.

> please ensure you have redis installed also.
> To install Redis in window:
```script
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis
```
it all the redis.
##### start the redis
```script
sudo service redis-server start
```

> install the mailhog also if  you are going to use this data.
```script
go install github.com/mailhog/MailHog@latest
```
start the celery also
``` script
celery -A app:celery_app worker -l INFO
```
##### setup complete.

