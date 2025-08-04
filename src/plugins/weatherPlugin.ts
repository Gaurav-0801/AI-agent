import OpenAI from "openai"
import type { Plugin } from "../services/pluginManager"

export class WeatherPlugin implements Plugin {
  name = "Weather"
  description = "Get current weather information for any city using AI knowledge"
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  canHandle(message: string): boolean {
    const weatherKeywords = [
      "weather",
      "temperature",
      "forecast",
      "climate",
      "rain",
      "sunny",
      "cloudy",
      "hot",
      "cold",
      "humid",
    ]
    const lowerMessage = message.toLowerCase()
    return weatherKeywords.some((keyword) => lowerMessage.includes(keyword))
  }

  async execute(message: string): Promise<any> {
    try {
      // Extract city name from message
      const city = this.extractCityName(message)

      if (!city) {
        return {
          error: "Could not determine city from message",
          message: "Please specify a city name for weather information",
        }
      }

      // Use OpenAI to get weather information
      const weatherPrompt = `Provide current weather information for ${city}. Include:
- Current temperature (approximate)
- Weather conditions (sunny, cloudy, rainy, etc.)
- Humidity level (approximate)
- Wind conditions
- Any notable weather patterns for this location and season

Format the response as a JSON object with the following structure:
{
  "city": "city name",
  "temperature": "temperature with unit",
  "condition": "weather condition",
  "humidity": "humidity percentage",
  "windSpeed": "wind speed with unit",
  "description": "brief weather description",
  "note": "mention this is AI-generated based on typical patterns"
}

Provide realistic weather data based on the city's typical climate and current season.`

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a weather information assistant. Provide realistic weather data based on typical climate patterns for the requested location and current season. Always format responses as valid JSON.",
          },
          {
            role: "user",
            content: weatherPrompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent responses
        max_tokens: 300,
      })

      const response = completion.choices[0]?.message?.content

      if (!response) {
        throw new Error("No response from OpenAI")
      }

      // Parse the JSON response
      try {
        const weatherData = JSON.parse(response)
        return {
          ...weatherData,
          timestamp: new Date().toISOString(),
          source: "AI-generated based on typical climate patterns",
        }
      } catch (parseError) {
        // If JSON parsing fails, return a structured response anyway
        return {
          city: city,
          temperature: "Unable to determine",
          condition: "Information unavailable",
          description: response, // Use the raw response as description
          note: "AI-generated weather information",
          timestamp: new Date().toISOString(),
          source: "AI-generated based on typical climate patterns",
        }
      }
    } catch (error) {
      console.error("Weather plugin error:", error)
      throw new Error(`Failed to get weather information: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private extractCityName(message: string): string | null {
    // Simple regex to extract city names
    const patterns = [
      /weather in ([a-zA-Z\s]+)/i,
      /weather for ([a-zA-Z\s]+)/i,
      /temperature in ([a-zA-Z\s]+)/i,
      /forecast for ([a-zA-Z\s]+)/i,
      /([a-zA-Z\s]+) weather/i,
      /how is the weather in ([a-zA-Z\s]+)/i,
      /what's the weather like in ([a-zA-Z\s]+)/i,
    ]

    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    // Fallback: look for common city names
    const commonCities = [
      "bangalore",
      "mumbai",
      "delhi",
      "chennai",
      "kolkata",
      "hyderabad",
      "pune",
      "london",
      "paris",
      "tokyo",
      "new york",
      "los angeles",
      "chicago",
      "boston",
      "seattle",
      "san francisco",
      "miami",
      "toronto",
      "vancouver",
      "sydney",
      "melbourne",
      "singapore",
      "hong kong",
      "dubai",
      "berlin",
      "madrid",
    ]
    const lowerMessage = message.toLowerCase()

    for (const city of commonCities) {
      if (lowerMessage.includes(city)) {
        return city
      }
    }

    return null
  }
}
