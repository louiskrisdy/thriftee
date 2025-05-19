'use server'

import { db } from ".."

export async function getAllTags() {
    try {
        const tags = await db.query.tags.findMany();
        if(!tags) throw new Error("Tags not found")
        return {success: tags}
    } catch (error) {
        return {error: "Failed to get tags"}
    }
}