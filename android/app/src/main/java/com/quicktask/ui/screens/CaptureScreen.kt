package com.quicktask.ui.screens

import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation.NavController
import com.quicktask.data.AppDatabase
import kotlinx.coroutines.launch
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CaptureScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val db = remember { AppDatabase.getDatabase(context) }
    
    var text by remember { mutableStateOf("") }
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var message by remember { mutableStateOf<String?>(null) }

    // Load settings to check if email is configured
    var destEmail by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(Unit) {
        val settings = db.settingsDao().getSettings()
        destEmail = settings?.destEmail
    }

    // Take picture launcher
    val takePictureLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture()
    ) { success ->
        if (success && imageUri != null) {
            message = "Photo captured"
        }
    }

    fun handleSend() {
        if (text.isBlank()) {
            message = "Please enter some text"
            return
        }

        if (destEmail.isNullOrBlank()) {
            message = "Please configure email in Settings"
            navController.navigate("settings")
            return
        }

        scope.launch {
            try {
                // TODO: Implement actual sending logic
                message = "Sent to $destEmail"
                text = ""
                imageUri = null
            } catch (e: Exception) {
                message = "Error: ${e.message}"
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "QuickTask",
            style = MaterialTheme.typography.headlineLarge
        )

        // Prevent line breaks - single line with ImeAction.Send
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Type a quick idea or task...") },
            singleLine = true, // Prevent line breaks
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(
                imeAction = androidx.compose.foundation.text.ImeAction.Send
            ),
            keyboardActions = androidx.compose.foundation.text.KeyboardActions(
                onSend = { handleSend() }
            )
        )

        message?.let { msg ->
            Text(
                text = msg,
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.bodySmall
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = {
                val uri = Uri.fromFile(java.io.File(context.cacheDir, "photo_${System.currentTimeMillis()}.jpg"))
                imageUri = uri
                takePictureLauncher.launch(uri)
            }) {
                Text("Camera")
            }
            Button(onClick = { navController.navigate("outbox") }) {
                Text("Outbox")
            }
            Button(onClick = { navController.navigate("settings") }) {
                Text("Settings")
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = { handleSend() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Send")
        }
    }
}

