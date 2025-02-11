declare global {
    interface Set<T> {
        isSubsetOf(otherSet: Set<T>): boolean;
    }
}
