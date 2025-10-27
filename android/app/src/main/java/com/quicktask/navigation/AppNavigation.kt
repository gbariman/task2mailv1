package com.quicktask.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.quicktask.ui.screens.CaptureScreen
import com.quicktask.ui.screens.OutboxScreen
import com.quicktask.ui.screens.SettingsScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "capture"
    ) {
        composable("capture") {
            CaptureScreen(navController = navController)
        }
        composable("outbox") {
            OutboxScreen(navController = navController)
        }
        composable("settings") {
            SettingsScreen(navController = navController)
        }
    }
}

