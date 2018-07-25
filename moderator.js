class moderatorModule {
	constructor(bot) {
		this.bot = bot;
		this.commands = bot.commands;
		this.perms = bot.commands.perms;
	}

	init() {
		this.registerCommands();
	}

	registerCommands() {
		var self = this;

		self.commands.addCommand({
			trigger: "!delete",
			function: self.deleteCommand,
			permCheck: self.perms.isInAdminRoom
		});
	}

	deleteCommand(msg) {
		var self = this;
		var channel = msg.channel;
		var params = msg.content.split(' ');
		var limit = params[1];
		if (limit == undefined) {
			limit=10;
		}
		channel.messages.fetch({ limit: limit, before:msg.id }).then(function(messages) {
			messages.forEach(function(message) {
				message.delete().catch();
			});
		});
		msg.reply("Moderated "+limit+" lines");
		msg.delete().cathc();
	}

	googleCommand(msg) {
		var req = "<http://lmgtfy.com/?q="+msg.content.substr(msg.content.indexOf(" ") + 1)+">";
		req = req.replace(/ /g,"%20");
		msg.channel.send(req);
		msg.delete();
	}

	pingCommand(msg) {
		var self = this;
		self.bot.checkCooldown("ping", function(){
			self.bot.addCooldown("ping", 60);
			msg.react("🇵").then(function(){
				msg.react("🇴").then(function(){
					msg.react("🇳").then(function(){
						msg.react("🇬").then().catch(console.error);
					}).catch(console.error);
				}).catch(console.error);
			}).catch(console.error);
		});
	}
}
module.exports = moderatorModule;
