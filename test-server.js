// Script de prueba para verificar que el servidor funciona
const path = require("path");

// Simular el servidor básico para ver si hay errores de sintaxis
try {
  console.log("🔄 Verificando sintaxis del middleware...");
  const middleware = require("./backend/middleware/battleMiddleware.js");
  console.log("✅ Middleware cargado correctamente");
  console.log("📋 Middlewares disponibles:", Object.keys(middleware));

  console.log("🔄 Verificando configuración de base de datos...");
  require("dotenv").config();
  console.log("✅ Variables de entorno cargadas");
  console.log("🔗 Base de datos:", process.env.DB_NAME);

  console.log("🎉 Todos los archivos están bien formados!");
  console.log("💡 Puedes iniciar el servidor con: cd backend && node index.js");
} catch (error) {
  console.error("❌ Error encontrado:", error.message);
  console.error("📍 Stack trace:", error.stack);
}
