class DomainError(Exception):
    """Base domain exception for cross-cutting use cases."""


class ResourceNotFoundError(DomainError):
    """Raised when a business resource cannot be located."""


class ValidationError(DomainError):
    """Raised when request input fails business or schema validation."""


class AuthenticationError(DomainError):
    """Raised when authentication is unavailable or invalid."""
