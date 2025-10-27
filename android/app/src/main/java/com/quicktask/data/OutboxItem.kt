package com.quicktask.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "outbox")
data class OutboxItem(
    @PrimaryKey val id: String,
    val subject: String,
    val body: String,
    val imageUri: String?,
    val status: String, // queued, sending, sent, failed
    val error: String?,
    val providerMessageId: String?,
    val createdAt: Long,
    val sentAt: Long?,
    val retries: Int
)

