from sys import argv
from subprocess import call
import os

script, filename = argv

def test():
	commands = []
	videoNames = []
	dir_path = ""
	with open(filename) as f:
		content = f.readlines()
		print 'Processing....'
		for line in content:
			if 'youtube.com' in line:
				vidName = line.split(":=")[0].strip()
				vidUrl = line.split(":=")[1].strip()
				vidVersion = line.split("v=")[1].strip()

				command = 'youtube-dl -x --audio-format "mp3" %s' % vidUrl
				commands.append(command)
				videoNames.append(vidName+'-'+vidVersion+'.mp3')

			else:
				dir_path = os.path.join('MIT', line)
				if not os.path.exists(dir_path):
					os.makedirs(dir_path)
			for command, name in zip(commands, videoNames):
				os.system(command)
				print name
				print dir_path + '/' + name
				# os.rename(name, dir_path + '/' + name)
			commands = []
	print 'hello world'

test()