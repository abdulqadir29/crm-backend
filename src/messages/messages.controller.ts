// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { MessagesService } from './messages.service';

// @Controller('messages')
// export class MessagesController {
//   constructor(private readonly messagesService: MessagesService) {}

//   // ✅ Single send (optional, can keep if needed)
//   @Post('send')
//   async sendMessage(@Body() body: { to: string; body: string }) {
//     return this.messagesService.sendMessage(body.to, body.body);
//   }

//   // ✅ Bulk send endpoint for frontend
//   @Post('bulk-send')
//   async bulkSend(@Body() body: { messages: { to: string; body: string }[] }) {
//     return this.messagesService.bulkSend(body.messages);
//   }

//   // ✅ Fetch templates
//   @Get('templates')
//   async getTemplates() {
//     return this.messagesService.fetchTemplates();
//   }

//   // ✅ Create template
//   @Post('templates')
//   async createTemplate(@Body() body: { name: string; content: string }) {
//     return this.messagesService.createTemplate(body.name, body.content);
//   }

//   // ✅ Send template messages
//   @Post('bulk-template-send')
//   async bulkTemplateSend(@Body() body: { messages: any[] }) {
//     return this.messagesService.bulkSendTemplate(body.messages);
//   }
// }

import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // ✅ Fetch all templates with WhatsApp approval status
  // Returns only: approved | pending | received
  @Get('templates')
  async getTemplates() {
    return this.messagesService.fetchTemplates();
  }

  // ✅ Create a twilio/text template and auto-submit for WhatsApp approval
  // Body: { name: string, content: string }
  // Use {{1}}, {{2}} placeholders in content for variables
  @Post('templates')
  async createTemplate(@Body() body: { name: string; content: string }) {
    return this.messagesService.createTemplate(body.name, body.content);
  }

  // ✅ Bulk send template messages to multiple recipients
  // Body: { messages: Array<{ to: string, contentSid: string, variables: Record<string, string> }> }
  @Post('bulk-template-send')
  async bulkTemplateSend(@Body() body: { messages: any[] }) {
    return this.messagesService.bulkSendTemplate(body.messages);
  }
}

// import { Controller, Post, Body, Get, Param } from '@nestjs/common';
// import { MessagesService } from './messages.service';

// @Controller('messages')
// export class MessagesController {
//   constructor(private readonly messagesService: MessagesService) {}

//   // ✅ Fetch templates (with approval status)
//   @Get('templates')
//   async getTemplates() {
//     return this.messagesService.fetchTemplates();
//   }

//   // ✅ Create template + auto submit for WhatsApp approval
//   @Post('templates')
//   async createTemplate(@Body() body: { name: string; content: string }) {
//     return this.messagesService.createTemplate(body.name, body.content);
//   }

//   // ✅ Send template messages
//   @Post('bulk-template-send')
//   async bulkTemplateSend(@Body() body: { messages: any[] }) {
//     return this.messagesService.bulkSendTemplate(body.messages);
//   }
// }