// src/lib/sheets.js
// Sends confirmed appointment data to Google Sheets via Apps Script webhook

export async function saveToSheet(appointment) {
  const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('VITE_SHEETS_WEBHOOK_URL not set — skipping Sheets save.')
    return { success: false, reason: 'no_webhook_url' }
  }

  try {
    // Google Apps Script requires no-cors mode
    await fetch(webhookUrl, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        id:       appointment.id,
        name:     appointment.name,
        phone:    appointment.phone,
        email:    appointment.email    || '',
        date:     appointment.date,
        timeSlot: appointment.timeSlot,
        service:  appointment.service,
        payment:  appointment.payment,
        notes:    appointment.notes    || '',
      }),
    })
    // no-cors means we can't read the response — assume success
    return { success: true }
  } catch (err) {
    console.error('Sheets webhook error:', err)
    return { success: false, error: err.message }
  }
}