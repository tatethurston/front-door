const { TWILIO_SID, TWILIO_TOKEN } = process.env;

const moment = require("moment-timezone");
const twilio = require("twilio");
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

// Generate twiml:
//const response = new twilio.twiml.VoiceResponse();
//response.pause({ length: 1 });
//response.say('Hello. Who is it?');
//response.pause({ length: 5 });
//response.play({ digits: "w9" });
//console.log(response.toString());

export const handler = async () => {
  // 8AM - 6PM
  const start = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(8, "hours");
  const end = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(18, "hours");
  const now = moment().tz("America/Los_Angeles");
  const allowedTime = start <= now && now <= end;

  if (!allowedTime) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response> <Dial> +16505764285 </Dial> </Response>
      `
    };
  }

  try {
    await client.messages.create({
      body: "I'm letting someone in.",
      from: "+16505130122",
      to: "+16505764285"
    });
  } catch (e) {
    console.log(e);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Pause length="1"/>
        <Say>Hello. Who is it?</Say>
        <Pause length="5"/>
        <Play digits="w9"/>
      </Response>
    `
  };
};
