import { WeatherPlugin } from "../plugins/weatherPlugin"
import { MathPlugin } from "../plugins/mathPlugin"

export interface PluginResult {
  pluginName: string
  result: any
  success: boolean
  error?: string
}

export interface Plugin {
  name: string
  description: string
  canHandle(message: string): boolean
  execute(message: string): Promise<any>
}

export class PluginManager {
  private plugins: Plugin[] = []

  constructor() {
    // Register built-in plugins
    this.registerPlugin(new WeatherPlugin())
    this.registerPlugin(new MathPlugin())
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.push(plugin)
    console.log(`Registered plugin: ${plugin.name}`)
  }

  async processMessage(message: string): Promise<PluginResult[]> {
    const results: PluginResult[] = []

    for (const plugin of this.plugins) {
      if (plugin.canHandle(message)) {
        try {
          const result = await plugin.execute(message)
          results.push({
            pluginName: plugin.name,
            result,
            success: true,
          })
        } catch (error) {
          results.push({
            pluginName: plugin.name,
            result: null,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    return results
  }

  getAvailablePlugins(): Array<{ name: string; description: string }> {
    return this.plugins.map((plugin) => ({
      name: plugin.name,
      description: plugin.description,
    }))
  }
}
