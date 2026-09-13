import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendWhatsAppMessage = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}) => {
  const phone = to?.trim();
  const text = message?.trim();

  if (!phone || !text) {
    return { success: false, error: "Phone number and message are required." };
  }

  if (!client || !whatsappNumber) {
    console.warn("WhatsApp is not configured. Skipping message.");
    return { success: false, error: "WhatsApp is not configured." };
  }

  const formattedPhone = phone.startsWith("whatsapp:")
    ? phone
    : `whatsapp:${phone.replace(/\s+/g, "")}`;

  try {
    const response = await client.messages.create({
      from: whatsappNumber,
      to: formattedPhone,
      body: text,
    });

    return { success: true, sid: response.sid };
  } catch (error: any) {
    console.error("WhatsApp message failed:", error);
    return { success: false, error: error?.message || "Unable to send WhatsApp message." };
  }
};
