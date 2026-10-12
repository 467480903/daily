# G2 机器人数采数据清单（2026-09-24）

本清单通过 SSH 只读检查 `agi@10.20.15.60` 和 `agi@10.20.15.194` 得到，用于选择待上传云端的数据。以下“条数”是实际存在的 `episode_*` **目录数**，尚未逐条验证文件完整性、质量或训练可用性。大小为 `du` 报告的磁盘占用，单位 GiB/MiB（1 GiB = 1024 MiB）；数采继续进行后，条数和大小会变化。

## 总览

| 机器 | 机器人数据主目录 | episode 目录数 | 主目录磁盘占用 |
| --- | --- | ---: | ---: |
| `10.20.15.60` | `/data/agi/g2_datasets/` | 8,268 | 242.19 GiB |
| `10.20.15.194` | `/data/agi/g2_datasets/g2_pi05_g2a0104c300179_operator_v1/` | 7,413 | 251.16 GiB |
| 合计 | 两台机器分别统计 | 15,681 | 493.36 GiB |

`10.20.15.60` 的主目录内含 28.08 GiB 的 `revision_0005.tar`。若只上传已展开的 episode 目录，可以跳过这个 tar。部分数据集之间还共享硬链接，因此下表中**单独统计**的目录大小不能直接求和；`242.19 GiB` 是整个主目录的一次去重磁盘统计。上传到新文件系统后，实际占用还取决于传输是否保留硬链接。

## 10.20.15.60：数据集

表中路径均相对于 `/data/agi/g2_datasets/`。操作员数据的 episode 位于更深的 revision 目录，详见下一节。

| 相对路径 | episode 数 | 单独统计的大小 |
| --- | ---: | ---: |
| `g2_alu_unload_left_arm_v1_20260614/` | 0 | 4 KiB |
| `g2_dataset_pi05_clean_head_down_v1/` | 15 | 147 MiB |
| `g2_dataset_v2/` | 86 | 912 MiB |
| `g2_dataset_v2_left_arm_midapproach_correction_20260608/` | 47 | 299 MiB |
| `g2_dataset_v2_left_arm_pilot_20260605/` | 151 | 1.77 GiB |
| `g2_left_hand_bottle_v1_20260711/` | 222 | 855 MiB |
| `g2_official_dual_arm_v1_20260613/` | 45 | 488 MiB |
| `g2_pi05_g2a0004c203364_operator_v1/` | 1,643 | 88.89 GiB，含下述 tar |
| `g2_pi05_official_style_thor_dual_gripperfix_smoke10/` | 10 | 408 MiB |
| `g2_pi05_official_style_thor_dual_test/` | 511 | 14.54 GiB |
| `g2_pi05_thor_aluminum_dual_gripperfix_v1/` | 351 | 10.39 GiB |
| `g2_pi05_thor_aluminum_dual_gripperfix_v2/` | 511 | 14.54 GiB |
| `g2_pi05_thor_honda_loading_dual_v1_20260713/` | 171 | 5.94 GiB |
| `g2_pi05_thor_honda_loading_dual_v2_20260714/` | 110 | 3.77 GiB |
| `g2_pi05_thor_honda_loading_dual_v3_20260714/` | 41 | 1.38 GiB |
| `g2_pi05_thor_xichong_grasp_lift_dual_pilot_v1_20260720/` | 2,021 | 49.26 GiB |
| `g2_pi05_thor_xichong_place_release_withdraw_dual_pilot_v1_20260720/` | 2,009 | 72.28 GiB |
| `g2_right_hand_bottle_v1_20260708/` | 94 | 378 MiB |
| `g2_right_hand_bottle_v1_20260709/` | 0 | 4 KiB |
| `g2_right_hand_bottle_v1_20260710/` | 229 | 921 MiB |
| `g2_timesync_v3/` | 0 | 4 KiB |
| `g2_timesync_v3_selftest/` | 1 | 3 MiB |

### 10.20.15.60：操作员数据细分

以下路径均相对于 `/data/agi/g2_datasets/g2_pi05_g2a0004c203364_operator_v1/`。

| 相对路径 | episode 数 | 大小 |
| --- | ---: | ---: |
| `xichong_grasp/dual_grasp_lift/revision_0001/` | 9 | 362 MiB |
| `xichong_place/dual_place_release_withdraw/revision_0001/` | 0 | 8 KiB |
| `xichong_place/dual_place_release_withdraw/revision_0003/` | 0 | 8 KiB |
| `xichong_place/dual_place_release_withdraw/revision_0004/` | 0 | 8 KiB |
| `xichong_place/dual_place_release_withdraw/revision_0005/` | 0 | 8 KiB |
| `xichong_right_grasp/generic_review_required/revision_0001/` | 266 | 7.04 GiB |
| `xichong_right_place/right_place_release_withdraw/revision_0001/` | 101 | 3.52 GiB |
| `xichong_right_single_grasp/right_grasp_lift/revision_0002/` | 26 | 714 MiB |
| `xichong_right_single_grasp/right_grasp_lift/revision_0004/` | 578 | 19.51 GiB |
| `xichong_right_single_grasp/right_grasp_lift/revision_0005/` | 663 | 29.69 GiB |

同级另有归档文件：

`/data/agi/g2_datasets/g2_pi05_g2a0004c203364_operator_v1/xichong_right_single_grasp/right_grasp_lift/revision_0005.tar`，28.08 GiB。已检查 tar 的条目以 `revision_0005/episode_*` 开头；它是该 revision 的归档形式，上传展开目录时通常无需同时上传。

## 10.20.15.194：操作员数据

以下路径均相对于 `/data/agi/g2_datasets/g2_pi05_g2a0104c300179_operator_v1/`。

| 相对路径 | episode 数 | 大小 |
| --- | ---: | ---: |
| `chongqie_101/right_place_release_withdraw/revision_0001/` | 0 | 8 KiB |
| `chongqie_right_place/right_place_release_withdraw/revision_0001/` | 802 | 33.98 GiB |
| `xichong_grasp/dual_grasp_lift/revision_0001/` | 0 | 16 KiB |
| `xichong_lift_pick/right_grasp_lift/revision_0001/` | 0 | 8 KiB |
| `xichong_right_grasp/right_grasp_lift/revision_0002/` | 851 | 37.96 GiB |
| `xichong_right_place/right_place_release_withdraw/revision_0002/` | 2,011 | 69.13 GiB |
| `xichong_right_place/right_place_release_withdraw/revision_0003/` | 803 | 28.60 GiB |
| `xichong_right_place/right_place_release_withdraw/revision_0006/` | 0 | 12 KiB |
| `xichong_right_single_grasp/right_grasp_lift/revision_0001/` | 1,063 | 23.44 GiB |
| `zhewan_right_grasp/right_grasp_lift/revision_0001/` | 802 | 27.47 GiB |
| `zhewan_right_place/right_place_release_withdraw/revision_0002/` | 1,081 | 30.58 GiB |

## 其他相关目录

| 机器 | 路径 | 大小 | 内容 |
| --- | --- | ---: | --- |
| `10.20.15.60` | `/data/agi/g2_backups/` | 119 MiB | 早期数据集 tar.gz 备份 |
| `10.20.15.194` | `/data/agi/groot_transfer/xichong_right_grasp_r0002_400_91_20260920/` | 19.80 GiB | 43 个 `.tar.zst` 分卷及配套清单，属于另行打包的导出数据 |
| `10.20.15.194` | `/data/record/` | 21.99 GiB | 机器人系统 `.pbdat` 记录；不是上述 episode 目录 |

## 上传时的路径选择

按任务选择上表中的完整目录或 revision，保留其内部相对路径和元数据。`10.20.15.60` 的 `revision_0005.tar` 与展开目录二选一；`10.20.15.194` 的 `groot_transfer` 导出与原始目录也应核对内容后再决定是否同时传输。0 条的目录没有 episode 可供训练。本清单只确认位置、目录数和大小；训练前仍需检查 `arrays.npz`、`frames.jsonl`、图像、时间同步和夹爪语义。
