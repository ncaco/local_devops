from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def validate_password_policy(password: str, min_length: int) -> bool:
    if len(password) < min_length:
        return False

    has_alpha = any(char.isalpha() for char in password)
    has_digit = any(char.isdigit() for char in password)
    return has_alpha and has_digit
