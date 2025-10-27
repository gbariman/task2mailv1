package com.quicktask.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun CaptureScreen(navController: NavController) {
    var text by remember { mutableStateOf("") }

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

        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Type a quick idea or task...") },
            maxLines = 5
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = { /* Camera */ }) {
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
            onClick = { /* Send */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Send")
        }
    }
}

