package com.quicktask.ui.screens

import android.content.Context
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.quicktask.data.AppDatabase
import com.quicktask.data.Settings
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val db = remember { AppDatabase.getDatabase(context) }
    
    var email by remember { mutableStateOf("") }
    var savedMessage by remember { mutableStateOf<String?>(null) }

    // Load existing settings
    LaunchedEffect(Unit) {
        val settings = db.settingsDao().getSettings()
        email = settings?.destEmail ?: ""
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Settings",
            style = MaterialTheme.typography.headlineLarge
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Destination Email") },
            placeholder = { Text("your@email.com") }
        )

        savedMessage?.let { message ->
            Text(
                text = message,
                color = if (message == "Saved!") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
            )
        }

        Button(
            onClick = {
                scope.launch {
                    try {
                        val currentSettings = db.settingsDao().getSettings()
                        val newSettings = Settings(
                            id = 1,
                            destEmail = email,
                            includeMetadata = currentSettings?.includeMetadata ?: true,
                            sendMethod = "relay"
                        )
                        db.settingsDao().insertSettings(newSettings)
                        savedMessage = "Saved!"
                    } catch (e: Exception) {
                        savedMessage = "Error: ${e.message}"
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Save")
        }
    }
}

