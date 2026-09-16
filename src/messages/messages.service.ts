// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { JsonFileUtil } from 'src/common/json-file.util';

// @Injectable()
// export class MessagesService {
//   private accountSid = process.env.TWILIO_ACCOUNT_SID;
//   private authToken = process.env.TWILIO_AUTH_TOKEN;
//   private fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., +14155238886

//   // ✅ Send a single WhatsApp message
//   async sendMessage(to: string, body: string) {
//     const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

//     const payload = new URLSearchParams();
//     payload.append('To', `whatsapp:${to}`);
//     payload.append('From', `whatsapp:${this.fromNumber}`);
//     payload.append('Body', body);

//     const authString = Buffer.from(
//       `${this.accountSid}:${this.authToken}`,
//     ).toString('base64');

//     try {
//       const response = await axios.post(url, payload, {
//         headers: {
//           Authorization: `Basic ${authString}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
//       console.log(
//         `✅ Message sent successfully:\nFrom: ${this.fromNumber}\nTo: ${to}\nMessage: ${body}`,
//       );
//       return response.data;
//     } catch (e) {
//       console.error('Twilio WhatsApp error:', e.response?.data || e.message);
//       throw e;
//     }
//   }

//   // ✅ Bulk send loop
//   async bulkSend(messages: { to: string; body: string }[]) {
//     const results: any = [];

//     for (const msg of messages) {
//       try {
//         const res = await this.sendMessage(msg.to, msg.body);
//         results.push({ to: msg.to, status: 'sent', data: res });
//         // ✅ Log per-message success in bulk
//         console.log(
//           `✅ Bulk Send Success:\nFrom: ${this.fromNumber}\nTo: ${msg.to}\nMessage: ${msg.body}`,
//         );
//       } catch (err) {
//         results.push({ to: msg.to, status: 'failed', error: err.message });
//       }
//     }

//     // ✅ Optional logging (remove if JsonFileUtil not used)
//     try {
//       const logs = JsonFileUtil.read('logs.json');
//       if (!logs.messages) logs.messages = [];
//       logs.messages.push({
//         type: 'bulk',
//         count: messages.length,
//         date: new Date().toISOString(),
//       });
//       JsonFileUtil.write('logs.json', logs);
//     } catch (e) {
//       console.warn('Skipping logs.json write:', e.message);
//     }

//     return { message: 'Bulk message operation complete', results };
//   }

//   async fetchTemplates() {
//     const url = 'https://content.twilio.com/v1/Content';

//     const authString = Buffer.from(
//       `${this.accountSid}:${this.authToken}`,
//     ).toString('base64');

//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Basic ${authString}`,
//         },
//       });

//       // 🔥 Normalize templates for frontend
//       return response.data.contents.map((tpl: any) => ({
//         sid: tpl.sid,
//         name: tpl.friendly_name,
//         language: tpl.language,
//         body:
//           tpl.types?.['twilio/text']?.body ||
//           tpl.types?.['twilio/quick-reply']?.body ||
//           '',
//         variables: Object.keys(tpl.variables || {}),
//       }));
//     } catch (e) {
//       console.error('Fetch templates error:', e.response?.data || e.message);
//       throw e;
//     }
//   }

//   async createTemplate(name: string, content: string) {
//     const url = 'https://content.twilio.com/v1/Content';

//     const authString = Buffer.from(
//       `${this.accountSid}:${this.authToken}`,
//     ).toString('base64');

//     return axios.post(
//       url,
//       {
//         friendly_name: name,
//         language: 'en',
//         variables: { '1': 'Customer' },
//         types: {
//           'twilio/text': {
//             body: content,
//           },
//         },
//       },
//       {
//         headers: {
//           Authorization: `Basic ${authString}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//   }

//   async sendTemplateMessage(to: string, contentSid: string, variables: any) {
//     const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

//     const payload = new URLSearchParams();
//     payload.append('To', `whatsapp:${to}`);
//     payload.append('From', `whatsapp:${this.fromNumber}`);
//     payload.append('ContentSid', contentSid);
//     payload.append('ContentVariables', JSON.stringify(variables));

//     const authString = Buffer.from(
//       `${this.accountSid}:${this.authToken}`,
//     ).toString('base64');

//     return axios.post(url, payload, {
//       headers: {
//         Authorization: `Basic ${authString}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });
//   }

//   async bulkSendTemplate(messages: any[]) {
//     const results: any = [];

//     for (const msg of messages) {
//       try {
//         const res = await this.sendTemplateMessage(
//           msg.to,
//           msg.contentSid,
//           msg.variables,
//         );

//         results.push({ to: msg.to, status: 'sent' });
//       } catch (err) {
//         results.push({ to: msg.to, status: 'failed' });
//       }
//     }

//     return results;
//   }
// }

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MessagesService {
  private accountSid = process.env.TWILIO_ACCOUNT_SID;
  private authToken = process.env.TWILIO_AUTH_TOKEN;
  private fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  // ============================================
  // 🔐 AUTH HEADER
  // ============================================
  private getAuthHeader() {
    const authString = Buffer.from(
      `${this.accountSid}:${this.authToken}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${authString}`,
    };
  }

  // ============================================
  // ✅ FETCH TEMPLATES + STATUS
  // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#review-content-templates-optional
  // ============================================
  async fetchTemplates() {
    try {
      const res = await axios.get('https://content.twilio.com/v1/Content', {
        headers: this.getAuthHeader(),
      });

      const templates = await Promise.all(
        res.data.contents.map(async (tpl: any) => {
          let status = 'unsubmitted';

          try {
            // Fetch WhatsApp approval status
            // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#fetch-an-approval-status-optional
            const approval = await axios.get(
              `https://content.twilio.com/v1/Content/${tpl.sid}/ApprovalRequests`,
              { headers: this.getAuthHeader() },
            );
            status = approval.data?.whatsapp?.status || 'unsubmitted';
          } catch {
            status = 'unsubmitted';
          }

          // Extract body across all known content types
          const types = tpl.types || {};
          const body =
            types['twilio/text']?.body ||
            types['twilio/quick-reply']?.body ||
            types['twilio/call-to-action']?.body ||
            types['twilio/card']?.body ||
            types['whatsapp/card']?.body ||
            '';

          // Extract variable keys from the variables map e.g. { "1": "Customer", "2": "Order" }
          const variables = Object.keys(tpl.variables || {});

          return {
            sid: tpl.sid,
            name: tpl.friendly_name,
            body,
            variables,
            status,
          };
        }),
      );

      // Return approved, pending, and received templates
      // Possible statuses: received | pending | approved | rejected
      // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#fetch-an-approval-status-optional
      return templates.filter((t) =>
        ['approved', 'pending', 'received'].includes(t.status),
      );
    } catch (e) {
      console.error('Fetch templates error:', e.response?.data || e.message);
      throw e;
    }
  }

  // ============================================
  // ✅ CREATE TEMPLATE + AUTO APPROVAL
  // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#create-a-content-template
  // ============================================
  async createTemplate(name: string, content: string) {
    try {
      // Dynamically extract variables from content string e.g. {{1}}, {{2}}
      const variableMatches = content.match(/\{\{(\d+)\}\}/g) || [];
      const uniqueVarNumbers = [
        ...new Set(variableMatches.map((v) => v.replace(/\{\{|\}\}/g, ''))),
      ];

      // Build variables map with self-evident sample values for WhatsApp approval
      // Docs: "use self-evident default variable values" for approval process
      const variablesMap: Record<string, string> = {};
      uniqueVarNumbers.forEach((num) => {
        variablesMap[num] = `Sample Value ${num}`;
      });

      // Step 1: Create the content template
      const res = await axios.post(
        'https://content.twilio.com/v1/Content',
        {
          friendly_name: name,
          language: 'en',
          variables: variablesMap,
          types: {
            'twilio/text': {
              body: content,
            },
          },
        },
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
      );

      const contentSid = res.data.sid;

      // Step 2: Auto-submit for WhatsApp approval
      // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#submit-a-content-template-for-whatsapp-approval-optional
      // WhatsApp template name must be lowercase with underscores only
      const whatsappTemplateName = name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      await axios.post(
        `https://content.twilio.com/v1/Content/${contentSid}/ApprovalRequests/whatsapp`,
        {
          name: whatsappTemplateName,
          category: 'UTILITY', // Options: UTILITY | MARKETING | AUTHENTICATION
        },
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        message: 'Template created & submitted for WhatsApp approval',
        sid: contentSid,
        whatsappTemplateName,
      };
    } catch (e) {
      console.error('Create template error:', e.response?.data || e.message);
      throw e;
    }
  }

  // ============================================
  // ✅ SEND TEMPLATE MESSAGE (Single)
  // Docs: https://www.twilio.com/docs/content/create-and-send-your-first-content-api-template#send-a-message-on-whatsapp
  // ============================================
  async sendTemplateMessage(
    to: string,
    contentSid: string,
    variables: Record<string, string>,
  ) {
    // Must use URL-encoded form data for Twilio Messages API
    const payload = new URLSearchParams();
    payload.append('To', `whatsapp:${to}`);
    payload.append('From', `whatsapp:${this.fromNumber}`);
    payload.append('ContentSid', contentSid);
    // ContentVariables must be a JSON string of variable substitutions
    // e.g. {"1": "John", "2": "ORD-123"}
    payload.append('ContentVariables', JSON.stringify(variables));

    return axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      payload,
      {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  // ============================================
  // ✅ BULK SEND (PARALLEL + SAFE)
  // ============================================
  async bulkSendTemplate(messages: any[]) {
    const results = await Promise.allSettled(
      messages.map(async (msg) => {
        // Validate required fields
        if (!msg.to || !msg.contentSid) {
          throw new Error(`Invalid payload for message: missing to/contentSid`);
        }

        const res = await this.sendTemplateMessage(
          msg.to,
          msg.contentSid,
          msg.variables || {},
        );

        return {
          to: msg.to,
          status: 'sent',
          sid: res.data.sid,
          messagingStatus: res.data.status, // queued | sent | delivered | failed
        };
      }),
    );

    // Map settled results (handles both fulfilled and rejected)
    const mapped = results.map((result, i) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          to: messages[i]?.to,
          status: 'failed',
          error:
            result.reason?.response?.data?.message ||
            result.reason?.message ||
            'Unknown error',
        };
      }
    });

    const sentCount = mapped.filter((r) => r.status === 'sent').length;
    const failedCount = mapped.filter((r) => r.status === 'failed').length;

    return {
      message: 'Bulk template send complete',
      summary: { sent: sentCount, failed: failedCount, total: mapped.length },
      results: mapped,
    };
  }
}


// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class MessagesService {
//   private accountSid = process.env.TWILIO_ACCOUNT_SID;
//   private authToken = process.env.TWILIO_AUTH_TOKEN;
//   private fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

//   // ============================================
//   // 🔐 AUTH HEADER
//   // ============================================
//   private getAuthHeader() {
//     const authString = Buffer.from(
//       `${this.accountSid}:${this.authToken}`,
//     ).toString('base64');

//     return {
//       Authorization: `Basic ${authString}`,
//     };
//   }

//   // ============================================
//   // ✅ FETCH TEMPLATES + STATUS
//   // ============================================
//   async fetchTemplates() {
//     try {
//       const res = await axios.get(
//         'https://content.twilio.com/v1/Content',
//         {
//           headers: this.getAuthHeader(),
//         },
//       );

//       const templates = await Promise.all(
//         res.data.contents.map(async (tpl: any) => {
//           let status = 'unknown';

//           try {
//             const approval = await axios.get(
//               `https://content.twilio.com/v1/Content/${tpl.sid}/ApprovalRequests`,
//               {
//                 headers: this.getAuthHeader(),
//               },
//             );

//             status = approval.data?.whatsapp?.status || 'unsubmitted';
//           } catch {
//             status = 'unsubmitted';
//           }

//           return {
//             sid: tpl.sid,
//             name: tpl.friendly_name,
//             body:
//               tpl.types?.['twilio/text']?.body ||
//               tpl.types?.['twilio/quick-reply']?.body ||
//               '',
//             variables: Object.keys(tpl.variables || {}),
//             status,
//           };
//         }),
//       );

//       // ✅ Only return usable templates
//       return templates.filter(
//         (t) => t.status === 'approved' || t.status === 'pending',
//       );
//     } catch (e) {
//       console.error('Fetch templates error:', e.response?.data || e.message);
//       throw e;
//     }
//   }

//   // ============================================
//   // ✅ CREATE TEMPLATE + AUTO APPROVAL
//   // ============================================
//   async createTemplate(name: string, content: string) {
//     try {
//       const res = await axios.post(
//         'https://content.twilio.com/v1/Content',
//         {
//           friendly_name: name,
//           language: 'en',
//           variables: { '1': 'Customer' },
//           types: {
//             'twilio/text': {
//               body: content,
//             },
//           },
//         },
//         {
//           headers: {
//             ...this.getAuthHeader(),
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       const contentSid = res.data.sid;

//       // 🔥 AUTO SUBMIT FOR WHATSAPP APPROVAL
//       await axios.post(
//         `https://content.twilio.com/v1/Content/${contentSid}/ApprovalRequests/whatsapp`,
//         {
//           name: name,
//           category: 'UTILITY',
//         },
//         {
//           headers: {
//             ...this.getAuthHeader(),
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       return {
//         message: 'Template created & submitted for approval',
//         sid: contentSid,
//       };
//     } catch (e) {
//       console.error('Create template error:', e.response?.data || e.message);
//       throw e;
//     }
//   }

//   // ============================================
//   // ✅ SEND TEMPLATE MESSAGE
//   // ============================================
//   async sendTemplateMessage(to: string, contentSid: string, variables: any) {
//     const payload = new URLSearchParams();
//     payload.append('To', `whatsapp:${to}`);
//     payload.append('From', `whatsapp:${this.fromNumber}`);
//     payload.append('ContentSid', contentSid);
//     payload.append('ContentVariables', JSON.stringify(variables));

//     return axios.post(
//       `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
//       payload,
//       {
//         headers: {
//           ...this.getAuthHeader(),
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//   }

//   // ============================================
//   // ✅ BULK SEND (PARALLEL + SAFE)
//   // ============================================
//   async bulkSendTemplate(messages: any[]) {
//     const results = await Promise.all(
//       messages.map(async (msg) => {
//         try {
//           // ✅ BASIC VALIDATION
//           if (!msg.contentSid || !msg.variables) {
//             throw new Error('Invalid payload');
//           }

//           const res = await this.sendTemplateMessage(
//             msg.to,
//             msg.contentSid,
//             msg.variables,
//           );

//           return {
//             to: msg.to,
//             status: 'sent',
//             sid: res.data.sid,
//           };
//         } catch (err) {
//           return {
//             to: msg.to,
//             status: 'failed',
//             error: err.response?.data || err.message,
//           };
//         }
//       }),
//     );

//     return {
//       message: 'Bulk template send complete',
//       results,
//     };
//   }
// }