export async function onRequestPost(context) {
    try {
        const geminiApiKey = context.env.GEMINI_API_KEY; // Accessing the secret API key from environment variable, replace with your env name if different
        const requestBody = await context.request.json();
        const keyword = requestBody.keyword;
        const interpretationStyle = requestBody.interpretationStyle;
         const language = requestBody.language;


      if (!geminiApiKey) {
        return new Response('GEMINI_API_KEY is not set in environment variables.', { status: 500 });
      }

        let prompt = '';
         if (language === 'tr'){
             prompt = `Lütfen şunları yap: 1) Kur'an'dan, İncil'den, İbn-i Sirin'in kitabından, Avicenna'nın kitaplarından, hadislerden ve diğer saygın İslami kaynaklardan doğrudan ilgili alıntıları içeren bir liste oluştur. 2) Rüyayla ilgili olarak doğrudan belirtilen metinleri kullan, herhangi bir yorum veya çıkarım yapma. 3) Listede kaynak adlarını, ayetleri veya hadisleri belirt. 4) Kaynaklardan belirtilen bilgiye dayalı olarak kısa açıklamalar yap. "${keyword}" anahtar kelimesini kullanarak kaynaklardan ilgili metinleri çıkar ve düzenle. Sonucu aşağıdaki biçimde liste halinde sun:

         Kaynak Adı 1:
              - Rüyayla ilgili metin 1
              - Rüyayla ilgili metin 2
        Kaynak Adı 2:
             - Rüyayla ilgili metin 1
             - Rüyayla ilgili metin 2`
         } else if (language === 'en') {
            prompt = `Please do the following: 1) Create a list containing direct quotes from the Quran, Bible, İbn-i Sirin’s book, Avicenna’s books, hadith, and other respected Islamic sources that are directly relevant to dreams. 2) Only use text that is directly stated within the source related to dreams, do not make any interpretations or inferences. 3) Include the name of the source, verses or hadith in the list. 4) Add brief explanation based on the directly stated information from source. Extract and organize the text related to the keyword "${keyword}" from those sources. Present the result as a list in the following format:
          Source Name 1:
              - Text related to the dream 1
              - Text related to the dream 2
          Source Name 2:
             - Text related to the dream 1
             - Text related to the dream 2`
         } else if (language === 'fr') {
              prompt = `Veuillez faire ce qui suit : 1) Créez une liste contenant des citations directes du Coran, de la Bible, du livre d'İbn-i Sirin, des livres d'Avicenne, des hadiths et d'autres sources islamiques respectées qui sont directement pertinentes pour les rêves. 2) N'utilisez que le texte qui est directement indiqué dans la source concernant les rêves, ne faites aucune interprétation ni inférence. 3) Incluez le nom de la source, les versets ou les hadiths dans la liste. 4) Ajoutez une brève explication basée sur les informations directement indiquées dans la source. Extrayez et organisez le texte relatif au mot-clé "${keyword}" à partir de ces sources. Présentez le résultat sous forme de liste dans le format suivant :
           Nom de la source 1 :
             - Texte relatif au rêve 1
              - Texte relatif au rêve 2
          Nom de la source 2 :
               - Texte relatif au rêve 1
               - Texte relatif au rêve 2`
         } else if (language === 'ar') {
             prompt = `يرجى القيام بما يلي: 1) إنشاء قائمة تتضمن اقتباسات مباشرة من القرآن الكريم والإنجيل وكتاب ابن سيرين وكتب ابن سينا والحديث النبوي ومصادر إسلامية أخرى موثوقة ذات صلة مباشرة بالأحلام. 2) استخدم فقط النصوص التي تم ذكرها مباشرة في المصدر المتعلق بالأحلام، ولا تقم بأي تفسيرات أو استنتاجات. 3) قم بتضمين اسم المصدر أو الآيات أو الأحاديث في القائمة. 4) قم بإضافة شرح موجز بناءً على المعلومات المذكورة مباشرة في المصدر. استخرج ونظم النص المتعلق بالكلمة المفتاحية "${keyword}" من تلك المصادر. قدم النتيجة في قائمة بالصيغة التالية:

         اسم المصدر 1:
           - نص متعلق بالحلم 1
             - نص متعلق بالحلم 2
         اسم المصدر 2:
              - نص متعلق بالحلم 1
              - نص متعلق بالحلم 2`
         }
        const geminiAPIUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey;

        const payload = {
           contents: [
               {
                parts: [{ text: prompt}]
               }
           ]
        }

         const geminiResponse = await fetch(geminiAPIUrl, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
            },
             body: JSON.stringify(payload),
        });

         if (!geminiResponse.ok) {
              throw new Error(`Gemini API error! Status: ${geminiResponse.status}`);
         }


         const geminiData = await geminiResponse.json();


         if(geminiData.candidates && geminiData.candidates.length > 0) {
          return new Response(JSON.stringify({interpretation: geminiData.candidates[0].content.parts[0].text}), {
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
            return new Response(JSON.stringify({interpretation:"Could not retrieve Interpretation"}),{
                headers: { 'Content-Type': 'application/json' },
            })
        }


    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
