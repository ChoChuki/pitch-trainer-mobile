# Musik 音感训练：GitHub 更新与部署指南

两个独立仓库：

- 钢琴 https://github.com/ChoChuki/pitch-trainer-mobile （v20.1）
- 小提琴 https://github.com/ChoChuki/violin-trainer-mobile （v2.4.1）

## 通过 GitHub 网页上传

1. 下载并 **解压** 对应的 `*_GitHub.zip`，不要直接把 ZIP 当成一个文件上传。
2. 打开对应的 GitHub 仓库，进入 `main` 分支。建议先通过分支或下载旧版本备份。
3. 点击 `Add file` → `Upload files`，将解压目录 **里面的全部文件及 `vendor` 文件夹** 拖入页面。文件 `index.html` 必须位于仓库根目录，不能变成 `pitch_v20.1/index.html`。
4. 确认要上传的是对应乐器的文件。添加提交说明，例如 `Update piano trainer to v20.1` 或 `Update violin trainer to v2.4.1`。
5. 提交变更（界面可能显示 `Commit changes` 或 `Propose changes`）。两站分别操作。

注意：GitHub 上更新仓库 ≠ 线上 Cloudflare 网站必然更新。只有此前已经连接 Git 自动部署的项目才会自动部署。若网站仍采用 Direct Upload，请继续通过原 Cloudflare 项目创建部署，使用对应的 `*_deploy.zip`，不要重新创建项目。

## 更新后验证

- 打开线上网站，确认页头版本分别为 `20.1` / `2.4.1`。如出现 `Update to the new version`，请在没有训练题进行时点击更新。
- AP learning：记忆卡同一个 E4 重听时应固定 E4。AP 正式测试连续题不应重复同一 **MIDI 音高**。不同八度的同名音不算重复。
- RP 课程：L1 为 1/2 半音，L2 为 1/2/3 半音，依次递进。独立测评无逐题对错反馈。
- 小提琴：四弦完整竖向指板、无翻页；Two notes 参考音持续可见。
- 练习数分钟后检查与监督插件同步情况，并确认历史记录仍在。
- 不要清除浏览器网站数据、卸载旧 PWA 或更换网站域名，避免丢失本地训练记录、学习级别及同步配对。

## 修改说明与限制

此版本基于 Claude Fable 交付的钢琴 v20.0／小提琴 v2.4.0，额外修改 AP 相邻题不重复相同 MIDI。对单八度、低关卡，排除重复必然会影响下一题音名概率；这不是独立盲抽，仍可能存在少量顺序线索。旧版依赖“允许重复”的测试应改为新规则。

已经通过：语法、音频资源路径与 ZIP 完整性、280,000+ 道 AP 随机模拟、延迟修复抽样及静态文件一致性。未重新实测：iPhone Safari 的真实采样播放、触控、蓝牙音频与 Cloudflare 线上同步。

GitHub ZIP 中的 `tests/test_ap_no_repeat.cjs` 可在 Node.js 22+ 下执行：`node tests/test_ap_no_repeat.cjs`。测试脚本不参与网站运行。
