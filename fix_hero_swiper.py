with open('src/components/HeroSwiper.tsx','r') as f:
    lines = f.readlines()

btn_block_lines = [
    '        {/* ⏮️⏭️ 视频切换按钮 */}\n',
    '        {bgVideos.length > 1 && (\n',
    '          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 pointer-events-none">\n',
    '            <button onClick={playPrev}\n',
    '              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/60 transition shadow-lg pointer-events-auto"\n',
    '              aria-label="上一个视频">\n',
    '              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n',
    '                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />\n',
    '              </svg>\n',
    '            </button>\n',
    '            <button onClick={playNext}\n',
    '              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/60 transition shadow-lg pointer-events-auto"\n',
    '              aria-label="下一个视频">\n',
    '              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n',
    '                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />\n',
    '              </svg>\n',
    '            </button>\n',
    '          </div>\n',
    '        )}\n',
    '\n',
]

matches = []
for i in range(len(lines)-2):
    if '          </button>' in lines[i] and '        )}' in lines[i+1]:
        matches.append(i + 2)

print(f"Found {len(matches)} matches")

if len(matches) >= 1:
    pos1 = matches[0]
    lines = lines[:pos1] + btn_block_lines + lines[pos1:]
    print(f"Inserted at first position (line {pos1})")

if len(matches) >= 2:
    matches2 = []
    for i in range(len(lines)-2):
        if '          </button>' in lines[i] and '        )}' in lines[i+1]:
            matches2.append(i + 2)
    if len(matches2) >= 2:
        pos2 = matches2[-1]
        lines = lines[:pos2] + btn_block_lines + lines[pos2:]
        print(f"Inserted at second position (line {pos2})")

with open('src/components/HeroSwiper.tsx','w') as f:
    f.writelines(lines)

print('Done!')
