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
             prompt = `Kur'an, İncil, İbn-i Sirin'in kitabı, Avicenna'nın kitapları ve diğer saygın kaynaklardan yola çıkarak "${keyword}" rüyası ile ilgili referansları ve olası ilişkili rüyaları bul ve sun. Rüyayı yorumlamak yerine, bu kaynaklardaki ilgili rüya anlatılarını ve açıklamalarını özetle. Yaşam tarzı ve sağlık durumunun uykuyu nasıl etkilediğiyle ilgili bilgileri de dahil et.  Mümkün olan her yerde ilgili hadis ve ayetlere referans ver. Sonucu detaylı bir liste olarak sun.`
         } else if (language === 'en') {
             prompt = `Find and present references and potentially related dreams for the keyword "${keyword}" from sources including the Quran, Bible, İbn-i Sirin’s book, Avicenna’s books, and other respected texts. Summarize related dream narratives and explanations from these sources rather than interpreting the dream itself. Include information on how lifestyle and health conditions might affect sleep. Provide references to relevant hadith and verses where applicable. Present the result as a detailed list.`
         } else if (language === 'fr') {
             prompt = `Trouvez et présentez des références et des rêves potentiellement liés pour le mot-clé "${keyword}" à partir de sources telles que le Coran, la Bible, le livre d'İbn-i Sirin, les livres d'Avicenne et d'autres textes respectés. Résumez les récits de rêves et les explications connexes tirées de ces sources au lieu d'interpréter le rêve lui-même. Incluez des informations sur la manière dont le style de vie et les conditions de santé pourraient affecter le sommeil. Fournissez des références aux hadiths et versets pertinents, le cas échéant. Présentez le résultat sous forme de liste détaillée.`
         } else if (language === 'ar') {
             prompt = `ابحث وقدم مراجع وأحلامًا محتملة ذات صلة بالكلمة المفتاحية "${keyword}" من مصادر تشمل القرآن الكريم والإنجيل وكتاب ابن سيرين وكتب ابن سينا ونصوص أخرى موثوقة. لخص روايات وتفسيرات الأحلام ذات الصلة من هذه المصادر بدلاً من تفسير الحلم نفسه. قم بتضمين معلومات حول كيفية تأثير نمط الحياة والظروف الصحية على النوم. قدم مراجع للأحاديث والآيات ذات الصلة حيثما ينطبق ذلك. قدم النتيجة في قائمة مفصلة.`
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
