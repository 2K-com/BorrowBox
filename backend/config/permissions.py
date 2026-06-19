from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read-only permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class IsListingOwner(permissions.BasePermission):
    """
    Object-level permission to only allow the owner of the listing associated
    with a borrow request to accept/reject it.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'listing'):
            return obj.listing.owner == request.user
        return getattr(obj, 'owner', None) == request.user


class IsBorrower(permissions.BasePermission):
    """
    Object-level permission to only allow the borrower of a request/transaction
    to perform actions on it.
    """
    def has_object_permission(self, request, view, obj):
        return getattr(obj, 'borrower', None) == request.user


class IsParticipant(permissions.BasePermission):
    """
    Object-level permission to only allow participants (borrower or owner)
    of a transaction to view/access it.
    """
    def has_object_permission(self, request, view, obj):
        return request.user in [obj.borrower, obj.owner]
