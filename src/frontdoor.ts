export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
  // Pacific Time
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  const now = parseInt(new Date().toLocaleString("en-US", {
    hour12: false,
    hour: 'numeric', timeZone: "America/Los_Angeles",
  }));

  // 6AM - 10PM
  const allowedTime = now >= 6 && now <= 22;

  if (!allowedTime) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response> <Dial> +16505764285 </Dial> </Response>
      `.trim()
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Gather numDigits="4" timeout="30" action="/Prod/front-door2">
          <Say>Hello. Please enter your 4 digit security code.</Say>
        </Gather>
      </Response>
    `.trim()
  };
};
