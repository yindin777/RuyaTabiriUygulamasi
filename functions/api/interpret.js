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
      if (interpretationStyle === 'followup'){
                if (language === 'tr'){
                    prompt = `Önceki rüya anahtar kelimesiyle bağlantılı önceki kaynakları (Kur'an, İncil, İbn-i Sirin'in kitabı, Avicenna'nın kitapları, hadisler ve diğer İslami kaynaklar) kullanarak detaylı, sohbet tonunda, kişisel, samimi ve anlaşılabilir bilgiler sun. Rüyaların gizemli dünyasına dal ve İbn-i Sirin'in rüya yorumlar kitabından bu rüya ile alakalı tüm yorumları tam ve detaylı bir şekilde ver. Kaynaklarda bulduğum bilgileri kullanarak, rüya sahibiyle empati kur ve ona yol göster. Kaynaklardaki ilgili metinleri ve alıntıları kullanarak, rüya ile ilgili daha derinlemesine açıklamalar yap. Daha çok hayırlara yönlendiren, pozitif etkilerinden bahset. "${keyword}" anahtar kelimesiyle ilgili, kaynaklarda geçen bilgilere, nasihatlere ve rüya tavsiyelerine dayanarak detaylı açıklamalar sun. Cevapları kısa kısa paragraf şeklinde, kolay anlaşılır ve sohbet tonunda sun.`
                } else if (language === 'en') {
                    prompt = `Using the previous dream keyword as context, provide a detailed, conversational, personal, friendly and easy to understand explanation using the previously used sources (Quran, Bible, İbn-i Sirin’s book, Avicenna’s books, hadith, and other Islamic sources). Immerse yourself in the mysterious world of dreams, and provide all of the related information from Ibn-i Sirin's book about the given dream, in full and detailed. Using the information I find in sources, empathize with the dreamer and guide them. Provide a more detailed explanation related to the dream based on relevant text and quotes from the previous sources. Focus more on the positive effects, and guidance towards good. Based on the information, advice, and dream recommendations mentioned in the sources, give detailed explanations regarding the keyword "${keyword}". Present the answers in short, easy-to-understand paragraphs, in a conversational tone.`
                } else if (language === 'fr') {
                     prompt = `En utilisant le mot-clé de rêve précédent comme contexte, fournissez une explication détaillée, conversationnelle, personnelle, amicale et facile à comprendre en utilisant les sources utilisées précédemment (Coran, Bible, livre d'İbn-i Sirin, livres d'Avicenne, hadiths et autres sources islamiques). Plongez-vous dans le monde mystérieux des rêves, et fournissez toutes les informations relatives au rêve donné du livre d'İbn-i Sirin, de manière complète et détaillée. En utilisant les informations que je trouve dans les sources, faites preuve d'empathie avec le rêveur et guidez-le. Fournissez une explication plus détaillée liée au rêve en vous basant sur les textes et citations pertinents des sources précédentes. Concentrez-vous davantage sur les effets positifs et les conseils vers le bien. En vous basant sur les informations, les conseils et les recommandations de rêves mentionnés dans les sources, donnez des explications détaillées concernant le mot-clé "${keyword}". Présentez les réponses dans de courts paragraphes faciles à comprendre, sur un ton conversationnel.`
                } else if (language === 'ar') {
                      prompt = `باستخدام الكلمة المفتاحية للحلم السابقة كسياق، قدم شرحًا تفصيليًا بأسلوب المحادثة والشخصي والودي وسهل الفهم باستخدام المصادر المستخدمة سابقًا (القرآن الكريم والإنجيل وكتاب ابن سيرين وكتب ابن سينا والأحاديث النبوية والمصادر الإسلامية الأخرى). انغمس في عالم الأحلام الغامض، وقدم كافة المعلومات المتعلقة بالحلم المحدد من كتاب ابن سيرين بشكل كامل ومفصل. باستخدام المعلومات التي أجدها في المصادر، وتعاطف مع صاحب الحلم ووجهه. قدم شرحًا أكثر تفصيلاً متعلقًا بالحلم بناءً على النصوص والاقتباسات ذات الصلة من المصادر السابقة. ركز أكثر على الآثار الإيجابية، والتوجيه نحو الخير. بناءً على المعلومات والنصائح وتوصيات الأحلام المذكورة في المصادر، قدم شروحات تفصيلية بخصوص الكلمة المفتاحية "${keyword}". قدم الإجابات في فقرات قصيرة سهلة الفهم، بأسلوب محادثة.`
                 }
      } else {
            if (language === 'tr'){
                  prompt = `İbn-i Sirin'in rüya yorumları kitabını ve diğer saygın İslam kaynaklarını, Kur'an'ı, İncil'i ve Tevrat'ı kullanarak, rüya ve uyku konusunda bilgili, empatik, arkadaş canlısı, ve samimi bir şekilde, rüya ve uyku ile ilgili sana sorulan sorulara bilgi ver. Rüya anahtar kelimesi olan "${keyword}" ile ilgili, hem rüya hem de uyku üzerine yazılmış metinlerde, alıntılarda ve nasihatlerde geçen bilgileri sun.  İbn-i Sirin'in rüya yorumları kitabından bu rüya ile alakalı tüm yorumları tam ve detaylı bir şekilde ver. Yaşam tarzının, beslenmenin, stresin ve diğer faktörlerin rüyayı nasıl etkileyebileceğine de değin. Bu etkenler arasındaki bağlantıyı açıkla.  Ayrıca rüya sahibi çok susadığını rüyasında gördüğünü söyledi, bu gibi durumlarda tıp bilimi ne diyor, uykuyu ve rüyayı etkileyen faktörleri de tıp biliminden destek alarak açıklayabilirsin. Rüyaların güvendiğin, salih ve haram yemeyen kişilerle paylaşılması gerektiği, rüyaların her zaman hayıra yorumlanması gerektiği nasihatini ve diğer nasihatleri belirt. Cevapları kısa kısa paragraf şeklinde, kolay anlaşılır ve sohbet tonunda sun.`
             } else if (language === 'en') {
                prompt = `Using İbn-i Sirin's book on dream interpretations, and other respected Islamic sources, including the Quran, the Bible, and the Torah, respond to questions regarding dreams and sleep, acting like a knowledgeable, empathetic, friendly, and sincere guide with deep knowledge of dreams and sleep. Regarding the dream keyword "${keyword}", provide information based on what has been written in texts, quotes, and advice related to both dreams and sleep, also provide all of the related information from Ibn-i Sirin's book about the given dream, in full and detailed. Also discuss how lifestyle, diet, stress, and other factors can affect the dream, and explain the connection between these factors. Additionally, if the dreamer mentioned they saw themselves feeling very thirsty in their dream, in such cases include medical information from scientific literature. State the advice that dreams should be shared with trusted, righteous individuals who do not eat what is forbidden, and that dreams should always be interpreted for the good, along with other advice. Present the answers in short, easy-to-understand paragraphs, in a conversational tone.`
            } else if (language === 'fr') {
                 prompt = `En utilisant le livre d'İbn-i Sirin sur l'interprétation des rêves et d'autres sources islamiques respectées, notamment le Coran, la Bible et la Torah, répondez aux questions concernant les rêves et le sommeil, en agissant comme un guide compétent, empathique, amical et sincère ayant une connaissance approfondie des rêves et du sommeil. Concernant le mot-clé de rêve "${keyword}", fournissez des informations basées sur ce qui a été écrit dans les textes, les citations et les conseils liés à la fois aux rêves et au sommeil, et fournissez également toutes les informations connexes du livre d'İbn-i Sirin sur le rêve donné, de manière complète et détaillée. Discutez également de la manière dont le style de vie, l'alimentation, le stress et d'autres facteurs peuvent affecter le rêve, et expliquez le lien entre ces facteurs. De plus, si le rêveur mentionne qu'il s'est vu avoir très soif dans son rêve, dans de tels cas, incluez des informations médicales provenant de la documentation scientifique. Indiquez que les rêves doivent être partagés avec des personnes de confiance, justes et qui ne mangent pas ce qui est interdit, et que les rêves doivent toujours être interprétés pour le bien, ainsi que d'autres conseils. Présentez les réponses dans de courts paragraphes faciles à comprendre, sur un ton conversationnel.`
            } else if (language === 'ar') {
                   prompt = `باستخدام كتاب ابن سيرين لتفسير الأحلام ومصادر إسلامية أخرى موثوقة، بما في ذلك القرآن الكريم والإنجيل والتوراة، أجب على الأسئلة المتعلقة بالأحلام والنوم، متصرفًا كمرشد ذي معرفة واسعة ومتعاطف وودود وصادق ولديه معرفة عميقة بالأحلام والنوم. فيما يتعلق بالكلمة المفتاحية للحلم "${keyword}"، قدم معلومات بناءً على ما كُتب في النصوص والاقتباسات والنصائح المتعلقة بكل من الأحلام والنوم، وقدم أيضًا كافة المعلومات ذات الصلة من كتاب ابن سيرين حول الحلم المحدد، بشكل كامل ومفصل. ناقش أيضًا كيف يمكن لنمط الحياة والنظام الغذائي والتوتر وعوامل أخرى أن تؤثر على الحلم، واشرح العلاقة بين هذه العوامل. بالإضافة إلى ذلك، إذا ذكر صاحب الحلم أنه رأى نفسه يشعر بالعطش الشديد في حلمه، ففي مثل هذه الحالات، قم بتضمين معلومات طبية من الأدبيات العلمية. اذكر النصيحة التي تنص على أنه يجب مشاركة الأحلام مع الأفراد الموثوق بهم والصالحين الذين لا يأكلون ما هو محرم، وأنه يجب تفسير الأحلام دائمًا من أجل الخير، إلى جانب النصائح الأخرى. قدم الإجابات في فقرات قصيرة سهلة الفهم، بأسلوب محادثة.`
            }
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
