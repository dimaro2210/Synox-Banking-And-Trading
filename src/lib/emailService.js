const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send';
const SERVICE_ID = 'service_w4cjf6q';
const TEMPLATE_ID = 'template_8bwpsjg';
const PUBLIC_KEY = '5D0mjvJ4CKC13XHpl';
const APP_URL = 'https://synoxbankandtrade.com';

export const EmailService = {
  sendEmail: async (templateParams) => {
    try {
      const response = await fetch(EMAILJS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('EmailJS error:', errorText);
        return { success: false, error: errorText };
      }

      return { success: true };
    } catch (error) {
      console.error('EmailService error:', error);
      return { success: false, error: error.message };
    }
  },

  sendAccountApproved: async (user) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Your Synox International Account Has Been Approved ✅',
      heading: 'Account Approved!',
      status_icon: '✅',
      icon_bg_color: '#e8f5e9',
      message: 'Great news! Your Synox International account has been verified and approved. You can now log in and access all banking and trading features.',
      details: `Account Number: ${user.account_number} | Account Type: ${user.account_type || 'Standard'}`,
      action_url: `${APP_URL}/login`,
      button_text: 'Login to Your Account'
    });
  },

  sendAccountRejected: async (user, reason) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Update on Your Synox International Application',
      heading: 'Application Not Approved',
      status_icon: '❌',
      icon_bg_color: '#fee2e2',
      message: 'We regret to inform you that your account application was not approved at this time.',
      details: `Reason: ${reason}`,
      action_url: `${APP_URL}/register`,
      button_text: 'Submit New Application'
    });
  },

  sendDepositApproved: async (user, amount, asset, cryptoAmount) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Your Deposit Has Been Verified ✅',
      heading: 'Deposit Verified!',
      status_icon: '✅',
      icon_bg_color: '#e8f5e9',
      message: 'Your crypto deposit has been verified and credited to your portfolio.',
      details: `Amount: $${amount.toLocaleString()} | Asset: ${asset} | Credited: ${cryptoAmount.toFixed(6)} ${asset}`,
      action_url: `${APP_URL}/dashboard`,
      button_text: 'View Your Portfolio'
    });
  },

  sendDepositRejected: async (user, amount, reason) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Deposit Verification Failed',
      heading: 'Deposit Not Approved',
      status_icon: '❌',
      icon_bg_color: '#fee2e2',
      message: 'Your recent deposit could not be verified.',
      details: `Amount: $${amount.toLocaleString()} | Reason: ${reason}`,
      action_url: `${APP_URL}/dashboard`,
      button_text: 'Contact Support'
    });
  },

  sendTransferApproved: async (user, amount, recipientName) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Bank Transfer Approved ✅',
      heading: 'Transfer Processed!',
      status_icon: '✅',
      icon_bg_color: '#e8f5e9',
      message: 'Your bank transfer has been approved and processed successfully.',
      details: `Amount: $${amount.toLocaleString()} | Recipient: ${recipientName}`,
      action_url: `${APP_URL}/dashboard`,
      button_text: 'View Transaction History'
    });
  },

  sendTransferDeclined: async (user, amount, reason) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Bank Transfer Declined',
      heading: 'Transfer Declined',
      status_icon: '❌',
      icon_bg_color: '#fee2e2',
      message: 'Your bank transfer was declined. Your funds have been returned to your balance.',
      details: `Amount: $${amount.toLocaleString()} | Reason: ${reason}`,
      action_url: `${APP_URL}/dashboard`,
      button_text: 'View Your Account'
    });
  },

  sendAccountFrozen: async (user) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Important: Account Restriction Notice',
      heading: 'Account Restricted',
      status_icon: '🔒',
      icon_bg_color: '#ffedd5',
      message: 'Your account has been temporarily restricted by our security department.',
      details: 'Please contact support for more information.',
      action_url: `${APP_URL}/login`,
      button_text: 'Contact Support'
    });
  },

  sendAccountUnfrozen: async (user) => {
    return EmailService.sendEmail({
      to_email: user.email,
      user_name: user.full_name,
      subject: 'Account Restriction Lifted ✅',
      heading: 'Account Reinstated',
      status_icon: '✅',
      icon_bg_color: '#e8f5e9',
      message: 'The restriction on your account has been lifted. You can now perform transactions normally.',
      details: 'All account features have been re-enabled.',
      action_url: `${APP_URL}/login`,
      button_text: 'Login to Your Account'
    });
  }
};
