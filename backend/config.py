class Config:
    DEBUG = True
    SQL_AlCHEMY_TRACK_MODIFICATIONS = False


class LocalConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    SQL_AlCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "nowibecomeinsane"
    SECRET_KEY = "thisshouldnotsame"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Auth"

    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379

    WTF_CSRF_ENABLED = False
