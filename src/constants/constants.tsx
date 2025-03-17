export const DEFAULT_BUCKETS = { parent: 'parent', child: 'child' };

export const createDefaultBuckets = () => ({
    [DEFAULT_BUCKETS.parent]: new Set<string>(),
    [DEFAULT_BUCKETS.child]: new Set<string>(),
});
