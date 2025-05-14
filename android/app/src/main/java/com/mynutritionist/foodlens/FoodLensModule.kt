package com.mynutritionist.foodlens

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import android.util.Log
import com.facebook.react.bridge.*
import com.doinglab.foodlens.sdk.core.FoodLensCore
import com.doinglab.foodlens.sdk.core.RecognitionResultHandler
import com.doinglab.foodlens.sdk.core.error.BaseError
import com.doinglab.foodlens.sdk.core.model.result.RecognitionResult
import com.doinglab.foodlens.sdk.core.type.*
import com.doinglab.foodlens.sdk.core.SearchResultHandler
import com.doinglab.foodlens.sdk.core.model.result.FoodSearchResult
import java.io.File
import java.io.InputStream

class FoodLensModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private val TAG = "FoodLensModule"
    private var currentPromise: Promise? = null

    private val foodLensCoreService by lazy {
        FoodLensCore.createFoodLensService(reactApplicationContext, FoodLensType.FoodLens)
    }
    
    private val foodLensCaloAIService by lazy {
        FoodLensCore.createFoodLensService(reactApplicationContext, FoodLensType.CaloAI)
    }

    override fun getName(): String = "FoodLensModule"

    init {
        reactContext.addActivityEventListener(this)
    }



    @ReactMethod
    fun predictImage(imageUri: String, promise: Promise) {
        Log.d(TAG, "📷 imageUri received: $imageUri")

        try {
            foodLensCoreService.setLanguage(LanguageConfig.KO)
            foodLensCoreService.setImageResizeOption(ImageResizeOption.QUALITY)
            foodLensCoreService.setNutritionRetrieveOption(NutritionRetrieveOption.ALL_NUTRITION)
            
            // Handle different URI formats
            val uri = when {
                imageUri.startsWith("file://") -> {
                    val path = Uri.parse(imageUri).path
                    Log.d(TAG, "📁 File path from URI: $path")
                    Uri.fromFile(File(path ?: ""))
                }
                imageUri.startsWith("content://") -> {
                    Log.d(TAG, "📄 Content URI detected")
                    Uri.parse(imageUri)
                }
                else -> {
                    Log.d(TAG, "🔄 Treating as raw path: $imageUri")
                    Uri.fromFile(File(imageUri))
                }
            }
            
            Log.d(TAG, "🔗 Processed URI: $uri")
            
            // Read image data
            val inputStream = reactApplicationContext.contentResolver.openInputStream(uri)
            if (inputStream == null) {
                Log.e(TAG, "❌ Failed to open input stream for URI: $uri")
                promise.reject("INPUT_STREAM_ERROR", "Cannot open image file")
                return
            }
            
            val byteData = inputStream.use { it.readBytes() }

            Log.d(TAG, "📦 byteData size: ${byteData.size}")

            if (byteData.isEmpty()) {
                promise.reject("READ_ERROR", "이미지를 읽을 수 없습니다.")
                return
            }

            predictWithFoodLens(byteData, promise)

        } catch (e: Exception) {
            Log.e(TAG, "❌ predictImage failed", e)
            promise.reject("PREDICT_IMAGE_ERROR", e.message)
        }
    }

    private fun predictWithFoodLens(byteData: ByteArray, promise: Promise) {
        
        foodLensCoreService.predict(byteData, object : RecognitionResultHandler {
            override fun onSuccess(result: RecognitionResult?) {
                if (result == null) {
                    promise.reject("RECOGNITION_NULL", "결과가 없습니다.")
                    return
                }

                try {
                    Log.d(TAG, "✅ Recognition success: ${result.foods.size} foods detected")
                    val resultMap = convertRecognitionResultToMap(result)
                    promise.resolve(resultMap)
                } catch (e: Exception) {
                    Log.e(TAG, "❌ convertRecognitionResultToMap failed", e)
                    promise.reject("PARSE_ERROR", e.message)
                }
            }

            override fun onError(errorReason: BaseError?) {
                
                val errorMessage = errorReason?.getMessage() ?: "Unknown error"  
                promise.reject("RECOGNITION_ERROR", errorMessage)
            }
        })
    }

    private fun convertRecognitionResultToMap(result: RecognitionResult): WritableMap {
        val resultMap = Arguments.createMap()
        val foodsArray = Arguments.createArray()

        result.foods.forEach { foodInfo ->
            val foodMap = Arguments.createMap()
            foodMap.putString("name", foodInfo.name ?: "")
            foodMap.putString("fullName", foodInfo.fullName ?: "")
            foodMap.putDouble("eatAmount", foodInfo.eatAmount)

            val nutrition = foodInfo.userSelected ?: foodInfo.candidates?.firstOrNull()
            nutrition?.let {
                val nutritionMap = Arguments.createMap()
                nutritionMap.putDouble("energy", it.energy)
                nutritionMap.putDouble("carbohydrate", it.carbohydrate)
                nutritionMap.putDouble("protein", it.protein)
                nutritionMap.putDouble("fat", it.fat)
                nutritionMap.putDouble("cholesterol", it.cholesterol)
                nutritionMap.putDouble("totalDietaryFiber", it.totalDietaryFiber)
                nutritionMap.putDouble("calcium", it.calcium)
                nutritionMap.putDouble("saturatedFattyAcid", it.saturatedFattyAcid)
                nutritionMap.putDouble("sodium", it.sodium)
                nutritionMap.putDouble("totalSugars", it.totalSugars)
                nutritionMap.putDouble("transFattyAcid", it.transFattyAcid)
                nutritionMap.putDouble("vitaminA", it.vitaminA)
                nutritionMap.putDouble("vitaminB6", it.vitaminB6)
                nutritionMap.putDouble("vitaminC", it.vitaminC)
                nutritionMap.putDouble("vitaminD", it.vitaminD)
                nutritionMap.putDouble("vitaminE", it.vitaminE)

                foodMap.putMap("nutrition", nutritionMap)
            }

            foodsArray.pushMap(foodMap)
        }

        resultMap.putArray("foods", foodsArray)
        result.imagePath?.let { resultMap.putString("imagePath", it) }

        return resultMap
    }


    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {}
    override fun onNewIntent(intent: Intent?) {}

    companion object {
        private const val PICK_IMAGE_REQUEST = 1001
    }
}