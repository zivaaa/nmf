import path from 'path';

export function dirname(importMetaUrl) {
    return path.dirname(new URL(importMetaUrl).pathname);
}