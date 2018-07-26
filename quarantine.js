class quarantine {
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
			trigger: ["!quarantine","!timeout","!quiet", "!q", "!kick"],
			function: self.quarantineCommand,
			permCheck: self.perms.isAdmin,
			thisarg: self
		});
		self.commands.addCommand({
			trigger: ["!unquarantine","!unq"],
			function: self.unquarantineCommand,
			permCheck: self.perms.isAdmin,
			thisarg: self
		});
		
	}

	quarantineCommand(msg) {
		var mentions = msg.orderedMentions();
		var target = mentions[0];
		var command = msg.parts.shift();
		msg.parts.shift();
		var length = null;
		console.log(msg.parts[0]);
		while (msg.parts[0] == "") {
			msg.parts.shift();
		}
		length = msg.parts[0];
		if (isNaN(length)) {
			if (command == "!kick") {
				length = 1;
			} else {
				length=null;
			}
		} else {
			msg.parts.shift()
		}
		var reason = msg.parts.join(' ');
		if (reason == "") {
			reason = "bad behaviour";
		}
		if (!target) {
			msg.reply("No user specified - Syntax: !quarantine @user#9999 <time> <reason>");
			return;
		}
		var qRole = msg.guild.roles.find("name","Quarantined");
		if (!qRole) {
			this.bot.logMessage("Couldn't find quarantined role");
			return;
		}
		target.roles.add(qRole);
		if (length!= null) {
			//schedule unq
			setTimeout(this.unquarantineCommand.bind(this, msg, target),length*60*1000);
			var qChannel = msg.guild.channels.find("name","quarantine");
			if(qChannel) {
				qChannel.send(target.toString() + " you have been quarantined by "+msg.author.toString()+" for "+length+" minutes for "+reason);
				qChannel.send("Please feel free to use this channel to discuss your case");
			}
			msg.reply("Quarantining "+target.displayName+" for "+length+" minutes ("+reason+")");
			msg.delete().catch();
		} else {
			var qChannel = msg.guild.channels.find("name","quarantine");
			if(qChannel) {
				qChannel.send(target.toString() + " you have been quarantined by "+msg.author.toString()+" for "+reason);
				qChannel.send("Please feel free to use this channel to discuss your case");
			}
			msg.reply("Quarantining "+target.displayName+" for "+reason);
			msg.delete().catch();
		}
	}
	unquarantineCommand(msg, target=null) {
		if (target==null) {
			var mentions = msg.orderedMentions();
			target = mentions[0];
		}
		if (!target) {
			msg.reply("No user specified - Syntax: !unquarantine @user#9999");
			return;
		}
		var qRole = msg.guild.roles.find("name","Quarantined");
		if (!qRole) {
			this.bot.logMessage("Couldn't find quarantined role");
			return;
		}
		target.roles.remove(qRole);
		var qChannel = msg.guild.channels.find("name","quarantine");
		if(qChannel) {
			qChannel.send("Unquarantined "+target.displayName);
		} else {
			msg.reply("Unquarantining "+target.displayName);
		}
		msg.delete().catch();
	}


}

module.exports = quarantine;
