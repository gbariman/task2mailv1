package com.quicktask.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "settings")
data class Settings(
    @PrimaryKey val id: Int = 1,
    val destEmail: String?,
    val includeMetadata: Boolean = true,
    val sendMethod: String = "relay"
)

