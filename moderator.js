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
			trigger: "!topic",
			function: self.topicCommand,
			permCheck: self.perms.isAdmin
		});
		self.commands.addCommand({
			trigger: ["!delete","!moderate"],
			function: self.deleteCommand,
			permCheck: self.perms.isAdmin
		});
	}

	topicCommand(msg) {
		var self=this;
		var channel = msg.channel;
		var command = msg.parts.shift();
		var topic = msg.parts.join(' ');
		console.log("new topic: "+topic);
		channel.setTopic(topic);
		channel.send("Topic has been set to \""+topic+"\" by "+msg.author.toString());
		msg.delete();

	}

	deleteCommand(msg) {
		var self = this;
		var channel = msg.channel;
		var mentions=msg.orderedMentions();
		if (mentions.length == 0) {
			console.log("Deleting all");
			var limit = msg.parts[1];
			if (limit == undefined) {
				limit=10;
			}
			channel.messages.fetch({ limit: limit, before:msg.id }).then(function(messages) {
				messages.forEach(function(message) {
					message.delete().catch();
				});
			});
			msg.reply("Moderated "+limit+" lines");
		} else {
			console.log("Moderating user");
			//handling mentions
			var target = mentions[0];
			var limit = msg.parts[2];
			var count = 0;
			var fetchLimit = 100;
			if (msg.parts.length > 3) {
				fetchLimit = msg.parts[3];
			}
			channel.messages.fetch({ limit: fetchLimit, before:msg.id }).then(function(messages) {
				messages.filter(m => m.author.id === mentions[0].id).forEach(function(message) {
					if (count<limit) {
						message.delete().catch();
						count++;
					}
				});
			}).then(function() {
				msg.reply("Moderated "+count+" lines")
			});
		}
		msg.delete().catch(); 
	}

}
module.exports = moderatorModule;
