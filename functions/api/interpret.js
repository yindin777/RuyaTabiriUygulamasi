// functions/api/interpret.js

export async function onRequestPost(context) {
    try {
        const geminiApiKey = context.env.GEMINI_API_KEY; // Accessing the secret API key from environment variable, replace with your env name if different
        const requestBody = await context.request.json();
        const keyword = requestBody.keyword;
        const interpretationStyle = requestBody.interpretationStyle;


      if (!geminiApiKey) {
        return new Response('GEMINI_API_KEY is not set in environment variables.', { status: 500 });
      }

        const prompt = `Interpret the dream keyword "${keyword}" from a ${interpretationStyle} perspective. Provide interpretations based on Judeo-Christian and Islamic literature, including references. Also, explain the possible influence of lifestyle factors.`


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
