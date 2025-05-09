data class Configuration(
    val name: String,
    val description: String,
    val version: String,
    val author: String,
    val license: String,
    val dependencies: List<String>,
    val settings: Map<String, String>
) {
    fun getSetting(key: String): String? {
        return settings[key]
    }
}