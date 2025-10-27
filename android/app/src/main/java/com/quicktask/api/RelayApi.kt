package com.quicktask.api

import com.google.gson.annotations.SerializedName

data class SendRequest(
    val to: String,
    val subject: String,
    val body: String,
    val attachmentBase64: String?,
    val attachmentName: String?
)

data class SendResponse(
    val ok: Boolean,
    val messageId: String?
)

