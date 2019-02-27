class ban {
	constructor(bot) {
		this.bot = bot;
		this.commands = bot.commands;
		this.perms = bot.commands.perms;
	}

	init() {
		var self = this;
		self.registerCommands();
	}

	postInit() {
		var self = this;
	}

	registerCommands() {
		var self = this;

		self.commands.addCommand({
			trigger: ["!forcekick"],
			function: self.forcekickCommand,
			permCheck: self.perms.isAdmin,
			thisarg: self
		});
		self.commands.addCommand({
			trigger: ["!ban"],
			function: self.banCommand,
			permCheck: self.perms.isAdmin,
			thisarg: self
		});
		self.commands.addCommand({
			trigger: ["!test"],
			function: self.testCommand,
			permCheck: self.perms.isAdmin,
			thisarg: self
		});

		
	}

	banCommand(msg) {
		var mentions = msg.orderedMentions();
		var target = mentions[0];
		var command = msg.parts.shift();
		msg.parts.shift();
		var length = null;
		console.log(msg.parts[0]);
		var reason = msg.parts.join(' ');
		if (reason == "") {
			reason = "bad behaviour";
		}
		if (!target) {
			msg.reply("No user specified - Syntax: !ban @user#9999 <reason>");
			return;
		}
		target.ban({reason:reason});
		target.send("You have been banned from "+msg.guild.name+" by "+msg.author.username+" for the following reason: "+reason);
		msg.reply("Banned "+target.displayName+" ("+reason+")");
		msg.delete().catch();
	}


	testCommand(msg) {
		var mentions = msg.orderedMentions();
		var target = mentions[0];
		var command = msg.parts.shift();
		msg.parts.shift();
		var length = null;
		console.log(msg.parts[0]);
		var reason = msg.parts.join(' ');
		if (reason == "") {
			reason = "bad behaviour";
		}
		if (!target) {
			msg.reply("No user specified - Syntax: !ban @user#9999 <reason>");
			return;
		}
		target.user.send(reason);
	}

	forcekickCommand(msg) {
		var mentions = msg.orderedMentions();
		var target = mentions[0];
		var command = msg.parts.shift();
		msg.parts.shift();
		var length = null;
		console.log(msg.parts[0]);
		var reason = msg.parts.join(' ');
		if (reason == "") {
			reason = "bad behaviour";
		}
		if (!target) {
			msg.reply("No user specified - Syntax: !forcekick @user#9999 <reason>");
			return;
		}
		target.user.send("You have been kicked from "+msg.guild.name+" by "+msg.author.username+" for the following reason: "+reason).then(function() {
			target.ban({reason:reason});
			msg.guild.members.unban(target.id);
			msg.reply("Kicked "+target.displayName+" from server ("+reason+")");
			msg.delete().catch();
		});
	}

}

module.exports = ban;
