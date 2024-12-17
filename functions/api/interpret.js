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
      let prompt = ''

      if (language === 'tr'){
          prompt = `İbn-i Sirin'in kitabından ve diğer İslami kaynaklardan yararlanarak, "${keyword}" rüya kelimesini ${interpretationStyle} perspektifinden yorumlayın. Ayrıca, rüyanın olası yaşam tarzı, biyolojik ve yaş faktörleri üzerindeki etkisini açıklayın. Ayrıca Yahudi-Hristiyan kaynaklarına ve modern bilimsel kaynaklara da başvurun.`
      } else if (language === 'en') {
        prompt = `Interpret the dream keyword "${keyword}" from a ${interpretationStyle} perspective, incorporating insights from İbn-i Sirin's book and other Islamic literature. Also, explain the possible influence of lifestyle, biological, and age factors on the dream, and include insights from Judeo-Christian texts and modern scientific perspectives.`
      } else if (language === 'fr') {
         prompt = `Interprétez le mot-clé de rêve "${keyword}" dans une perspective ${interpretationStyle}, en intégrant des éléments du livre d'İbn-i Sirin et d'autres textes islamiques. Expliquez aussi l'influence possible du style de vie, des facteurs biologiques et de l'âge sur le rêve, tout en incluant des perspectives des textes judéo-chrétiens et des approches scientifiques modernes.`
      } else if (language === 'ar') {
           prompt = `فسر الكلمة المفتاحية للحلم "${keyword}" من منظور ${interpretationStyle}، مع دمج رؤى من كتاب ابن سيرين والأدب الإسلامي الآخر. اشرح أيضًا التأثير المحتمل لنمط الحياة والعوامل البيولوجية والعمر على الحلم، وقم بتضمين رؤى من النصوص اليهودية المسيحية ووجهات النظر العلمية الحديثة.`
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
