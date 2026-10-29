#!/usr/bin/env python3
from pathlib import Path
from copy import copy
from zipfile import ZipFile, ZIP_DEFLATED
from tempfile import TemporaryDirectory
import shutil
import xml.etree.ElementTree as ET

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches

BASE = Path(__file__).resolve().parent
OUT = BASE / "reasoning_arm_output"
OUT.mkdir(exist_ok=True)

PPT_REF = BASE / "市场机会调研报告-底盘式机器人.pptx"
DOCX_REF = BASE / "底盘式人形机器人项目可行性分析报告(1).docx"
XLSX_REF = BASE / "MY-MPR-00-02_预立项决策评审表DCP1-底盘式人形机器人.xlsx"

PPT_OUT = OUT / "市场机会调研报告-推理式协作臂.pptx"
DOCX_OUT = OUT / "推理式协作臂项目可行性分析报告.docx"
XLSX_OUT = OUT / "MY-MPR-00-02_预立项决策评审表DCP1-推理式协作臂.xlsx"


def set_shape_text(slide, index, text):
    shape = slide.shapes[index]
    tf = shape.text_frame
    sample = None
    for p in tf.paragraphs:
        if p.runs:
            r = p.runs[0]
            sample = {
                "name": r.font.name,
                "size": r.font.size,
                "bold": r.font.bold,
                "italic": r.font.italic,
            }
            try:
                sample["rgb"] = r.font.color.rgb
            except Exception:
                sample["rgb"] = None
            break
    shape.text = text
    if sample:
        for p in tf.paragraphs:
            for r in p.runs:
                r.font.name = sample["name"]
                r.font.size = sample["size"]
                r.font.bold = sample["bold"]
                r.font.italic = sample["italic"]
                if sample["rgb"] is not None:
                    r.font.color.rgb = sample["rgb"]


def build_pptx():
    prs = Presentation(PPT_REF)
    s = prs.slides
    set_shape_text(s[0], 3, "项目名称：推理式协作臂")
    for p in s[0].shapes[3].text_frame.paragraphs:
        for run in p.runs:
            run.font.color.rgb = RGBColor(255, 255, 255)
    set_shape_text(s[0], 8, "汇 报 人：曾贤\n汇报日期：2026年10月28日")

    set_shape_text(s[3], 0, "01 市场机会及客户需求分析")
    set_shape_text(s[3], 3, "5 大驱动")
    set_shape_text(s[3], 4, "高层建议、竞品演进、内部生态、技术变革、力控优势")
    set_shape_text(s[3], 6, "市场机会的核心判断")
    set_shape_text(s[3], 8, "安川、汇川、KUKA 等正布局运动控制推理模块。")
    set_shape_text(s[3], 10, "集团拥有大量六轴机械臂及工业数据采集条件，可从应用侧切入。")
    set_shape_text(s[3], 12, "VLA、WAM 与 Agentic 技术将进入工业自动化，力控路线形成窗口。")

    set_shape_text(s[4], 1, "目标客户分三层：内部项目、内部产品采购与外部市场")
    set_shape_text(s[4], 3, "BU 技术中心")
    set_shape_text(s[4], 5, "集团三个 BU 技术中心及所属工厂")
    set_shape_text(s[4], 6, "2027 下半年直接采购产品，由技术中心自行完成工业落地。")
    set_shape_text(s[4], 8, "内部自动化项目")
    set_shape_text(s[4], 10, "敏实内部非标自动化与场景实施项目")
    set_shape_text(s[4], 11, "2027 上半年由敏智小型实施团队交付推理式自动化项目。")
    set_shape_text(s[4], 13, "外部工业客户")
    set_shape_text(s[4], 15, "机械臂用户、系统集成商与设备厂商")
    set_shape_text(s[4], 16, "成熟后销售推理式协作臂及推理式运动控制器。")

    set_shape_text(s[5], 2, "传统机械臂正向“控制器 + 推理 + 多传感”演进。")
    set_shape_text(s[5], 5, "竞争类别")
    set_shape_text(s[5], 7, "典型布局")
    set_shape_text(s[5], 9, "对本项目的影响")
    set_shape_text(s[5], 11, "日系工业机器人")
    set_shape_text(s[5], 13, "安川：六轴本体、运动控制器与智能模块协同研发。")
    set_shape_text(s[5], 15, "可靠性和渠道优势明显，需用内部场景与力控差异化。")
    set_shape_text(s[5], 17, "国产运动控制")
    set_shape_text(s[5], 19, "汇川：控制器、伺服与工业自动化生态完整。")
    set_shape_text(s[5], 21, "国产化和成本竞争强，项目须加快控制器及应用闭环。")
    set_shape_text(s[5], 23, "欧系工业机器人")
    set_shape_text(s[5], 25, "KUKA：成熟六轴机械臂与数字化、感知能力融合。")
    set_shape_text(s[5], 27, "存量装机基础大，可优先验证兼容改造与数据复用。")

    set_shape_text(s[6], 2, "产品定位：面向工业推理作业的七轴力控协作臂与运动控制器。")
    set_shape_text(s[6], 5, "感知与数据层")
    set_shape_text(s[6], 6, "全局相机、末端相机\n关节角、末端力与视频数据")
    set_shape_text(s[6], 9, "控制与推理层")
    set_shape_text(s[6], 10, "ROS 2 / MoveIt、运动控制器\nJetson Thor、GR00T 与 Agentic")
    set_shape_text(s[6], 13, "工业应用层")
    set_shape_text(s[6], 14, "上下料、装配、柔性抓取\n失败识别、自主纠正与复位")
    set_shape_text(s[6], 17, "力位混合：位置、速度、力矩与六维力传感协同控制")
    set_shape_text(s[6], 19, "安全可靠：抱闸、限位、碰撞检测及连续运行验证")
    set_shape_text(s[6], 21, "端侧推理：华为、NVIDIA、平头哥芯片生态适配")
    set_shape_text(s[6], 23, "模型落地：数据采集、后训练、部署与失败闭环纠正")
    for idx in range(15, 24):
        s[6].shapes[idx].top -= Inches(0.22)

    set_shape_text(s[7], 0, "04 新产品与当前业务的关联性")
    set_shape_text(s[7], 3, "与当前业务的关联")
    set_shape_text(s[7], 5, "集团现有 KUKA、安川、新松六轴机械臂，可提供数据与工位验证。")
    set_shape_text(s[7], 7, "成熟机器人零部件制造能力可支撑关节、电机、结构件和装配。")
    set_shape_text(s[7], 9, "内部协同价值")
    set_shape_text(s[7], 11, "协作臂为敏实关节电机建立内部集成、负载与可靠性测试场景。")
    set_shape_text(s[7], 13, "内部工业项目形成真实数据闭环，加速电机和推理系统迭代。")
    set_shape_text(s[7], 14, "项目把自研关节电机、推理控制器与工业场景沉淀为统一产品生态。")

    set_shape_text(s[8], 2, "先内部验证，再产品复制；2028年决定扩张或止损。")
    set_shape_text(s[8], 4, "进入基础")
    set_shape_text(s[8], 6, "自研关节电机、工业场景和存量六轴机械臂形成数据与验证条件。")
    set_shape_text(s[8], 8, "无传统位控产品包袱，可直接布局力位混合控制与 Agentic 路线。")
    set_shape_text(s[8], 9, "关键里程碑")
    set_shape_text(s[8], 11, "2026 Q4：完成 7 轴协作臂；2027.02：完成推理式运动控制器。")
    set_shape_text(s[8], 13, "2027 Q2 内部落地，Q3 小批量 10 套，Q4 转向力位混合与产线推理服务器。")

    prs.save(PPT_OUT)


W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)
NSW = {"w": W}


def replace_word_text(container, text):
    nodes = container.findall(".//w:t", NSW)
    if nodes:
        nodes[0].text = text
        for n in nodes[1:]:
            n.text = ""


def build_docx():
    with TemporaryDirectory(prefix="reasoning-arm-docx-") as td:
        root_dir = Path(td)
        with ZipFile(DOCX_REF) as z:
            z.extractall(root_dir)
        doc_path = root_dir / "word" / "document.xml"
        tree = ET.parse(doc_path)
        root = tree.getroot()
        body = root.find("w:body", NSW)
        blocks = [x for x in body if x.tag.rsplit('}', 1)[-1] in ("p", "tbl")]

        paragraph_replacements = {
            0: "推理式协作臂项目",
            1: "可行性分析报告",
            3: "一、项目概况",
            4: "我部门拟研发推理式协作臂，形成由七轴协作臂本体、运动控制器、推理模块、全局相机、末端相机及末端六维力传感器组成的工业作业平台。产品以公司自研谐波关节电机为基础，先实现传统轨迹编程和基础动力学控制，再逐步集成 GR00T 等视觉—语言—动作模型及 Agentic 推理能力。",
            5: "项目面向敏实内部上下料、装配和柔性抓取场景，先以内部自动化项目完成验证，再向三个 BU 技术中心销售整机和控制器，成熟后面向外部客户销售。2026 年研发硬件及工装预算预计20万元，不含研发人员工资。",
            6: "二、建设背景与必要性",
            7: "项目需求来自公司高层对推理自动化工业应用的指导。安川、汇川、KUKA 等传统工业机器人厂商正研发运动控制器推理模块，典型系统由六轴机械臂、运动控制器、推理模块、全局相机、末端相机及末端六维力传感器构成，使传统机械臂具备感知、判断和动作纠错能力。",
            8: "敏实集团拥有大量 KUKA、安川、新松等品牌六轴机械臂，具备采集工业作业关节角和末端视频数据的条件；集团同时具备机器人零部件和关节电机制造能力。研发协作臂可为自研关节电机建立内部集成、负载和可靠性验证场景，形成从核心部件、整机、控制器到工业应用的数据闭环。未来 VLA、WAM 与 Agentic 技术将冲击基于轨迹编程的传统自动化，力位混合控制将成为敏实差异化切入机会。",
            9: "三、建设目标与内容",
            10: "项目目标是分阶段完成推理式协作臂本体、推理式运动控制器和工业场景应用闭环，并建立可复制、可交付、可小批量生产的产品体系。",
            11: "2026 年第四季度完成七轴协作臂样机，采用敏实自研谐波关节电机，末端负载2kg，基于 ROS 2 / MoveIt 实现传统轨迹编程。",
            12: "2027 年2月前完成推理式运动控制器，采用 NVIDIA Jetson Thor，支持 GR00T 1.7 后训练场景模型，并预留后续模型升级能力。",
            13: "2027 年第二季度在敏实任一 BU 完成推理式自动化项目工业落地，由敏智整机研发部负责实施。",
            14: "2027 年第三季度完成10套小规模量产，并支持 BU 技术中心在无需敏智驻场的情况下独立完成应用。",
            15: "2027 年第四季度研发力位混合控制协作臂、灵巧手及产线级外置推理服务器，支持10台以内机械臂一对多 Agentic 推理。",
            16: "四、技术方案与关键技术",
            17: "1. 协作臂本体与运动控制",
            18: "首代产品采用七轴协作臂结构和敏实自研带抱闸谐波关节电机，目标售价5万元/台，内含约5000元工控机。控制系统基于 ROS 2 / MoveIt，完成运动学、轨迹规划、关节同步、碰撞检测和基础动力学控制。",
            19: "2. 多模态感知与数据闭环",
            20: "系统配置全局相机、末端相机和末端六维力传感器，同步采集关节角、末端位姿、视频与力觉数据，形成工业作业数据集，用于模型后训练、场景迁移和失败样本回放。",
            21: "3. 推理式运动控制器",
            22: "推理控制器采用 NVIDIA Jetson Thor 等端侧算力平台，部署 GR00T 1.7 或后续模型，将视觉、语言和任务状态转换为动作指令；同时研究华为、NVIDIA、平头哥三类推理芯片的软件生态与适配方式。",
            23: "4. 主要技术卡点",
            24: "推理输出与工业运动控制之间需要建立安全约束、动作限幅、碰撞检测和异常复位机制。",
            25: "自研关节电机需要完成位置、速度、力矩、温升、抱闸及连续负载条件下的可靠性验证。",
            26: "全局视觉、末端视觉、六维力和关节数据需要完成时间同步、坐标标定与多模态对齐。",
            27: "从位控到力位混合控制、从端侧推理到产线服务器一对多推理，需要保持产品接口和数据格式兼容。",
            28: "五、市场与场景可行性",
            29: "近期客户首先来自敏实内部三个 BU 的技术中心及工厂自动化项目。2027 年上半年以敏智实施团队交付内部非标项目，预计单个项目合同约30万元；2027 年下半年逐步转为向 BU 技术中心直接销售推理式协作臂，由客户工程师自行完成落地。",
            30: "中长期可向外部客户销售推理式协作臂和推理式运动控制器。2028 年一季度设置市场检视点：若传统厂商已形成成熟可靠产品且本项目无竞争优势，则停止外部扩张并优先采用成熟方案；若市场仍缺少可靠产品，则扩大生产和外部销售。",
            31: "六、预算与经营指标估算",
            33: "以上研发支出不含研发人员工资，主要覆盖硬件采购、非标工装、模型训练、灵巧手及外部技术指导。2027 年第三季度支出需根据10套小批量方案另行核算。",
            34: "七、实施计划",
            36: "八、预期成果与验收指标",
            37: "完成一台七轴协作臂样机，末端负载2kg，并实现 ROS 2 / MoveIt 轨迹编程。",
            38: "完成一套推理式运动控制器，支持 Jetson Thor 和 GR00T 场景模型部署。",
            39: "在敏实内部完成至少一个推理式自动化工业项目落地。",
            40: "完成10套小批量生产验证，并形成 BU 技术中心可独立实施的操作与交付资料。",
            41: "2026 年形成1项实用新型专利；2027 年形成3项外观或实用新型、1项发明专利及3项软件著作权。",
            42: "力争与 NVIDIA、浙江科技大学等机构发表1篇机器人领域联合论文。",
            43: "九、风险分析与控制",
            44: "技术风险：推理模型稳定性、节拍和成功率可能不足。项目采用传统轨迹控制兜底，并通过数据回放、失败样本训练和安全状态机逐步提升。",
            45: "产品风险：自研关节电机及协作臂可靠性可能低于传统厂商。项目将开展温升、负载、抱闸、碰撞和连续运行测试，并优先在内部低风险场景验证。",
            46: "市场风险：安川、汇川、KUKA 等厂商可能快速推出成熟产品。项目设置2028年一季度检视点，根据竞争优势决定扩大销售或停止外部扩张。",
            47: "经营风险：小批量物料成本和现场实施成本存在不确定性。项目按样机、控制器、内部 POC、小批量四阶段投入，每阶段通过评审后再进入下一阶段。",
            48: "十、可行性结论",
            49: "本项目以用户侧工业场景、存量机械臂数据、自研关节电机和整机研发能力为基础，具备从协作臂本体、运动控制器到推理自动化应用的内部闭环条件。项目路线与集团内部产品生态和未来工业智能化方向一致。",
            50: "建议按阶段立项：2026 年先完成七轴样机和基础控制，2027 年完成推理控制器、内部 POC 和小批量验证，并在2028年一季度依据产品可靠性和外部竞争格局作继续扩张或止损决策。",
        }
        for idx, text in paragraph_replacements.items():
            replace_word_text(blocks[idx], text)

        def set_table(block_idx, rows):
            tbl = blocks[block_idx]
            trs = tbl.findall("w:tr", NSW)
            for ri, vals in enumerate(rows):
                cells = trs[ri].findall("w:tc", NSW)
                for ci, val in enumerate(vals):
                    replace_word_text(cells[ci], str(val))

        set_table(2, [
            ["申报部门", "敏智整机研发部"],
            ["项目负责人", "曾贤"],
            ["实施周期", "2026年第四季度—2027年第四季度"],
            ["申请预算", "2026年研发预算20万元"],
        ])
        set_table(32, [
            ["阶段", "研发支出（万元）", "经营与投入说明"],
            ["2026年", "20", "硬件采购、非标工装与样机建设；暂无营收"],
            ["2027年Q1", "15", "Thor控制器与模型训练；争取内部POC项目约30万元/项"],
            ["2027年Q2", "50", "小批量物料与内部项目实施；项目合同约30万元/项"],
            ["2027年Q4", "50", "灵巧手、力控与外部指导；预计内部销售收入约50万元"],
            ["已明确合计", "135", "不含2027年Q3小批量10套的待核算支出"],
        ])
        set_table(35, [
            ["阶段", "主要工作"],
            ["2026年Q4", "完成七轴协作臂样机、ROS 2 / MoveIt轨迹编程与基础动力学控制。"],
            ["2027年2月前", "完成Jetson Thor推理式运动控制器，支持GR00T场景模型部署。"],
            ["2027年Q2—Q3", "完成内部工业落地，并小规模量产10套，支持BU技术中心独立实施。"],
            ["2027年Q4", "研发力位混合协作臂、灵巧手及一对多产线级推理服务器。"],
        ])
        # Keep the implementation-plan table compact enough to avoid a blank
        # continuation row on the next page in LibreOffice/Word pagination.
        plan_tbl = blocks[35]
        for p in plan_tbl.findall(".//w:p", NSW):
            ppr = p.find("w:pPr", NSW)
            if ppr is None:
                ppr = ET.Element(f"{{{W}}}pPr")
                p.insert(0, ppr)
            spacing = ppr.find("w:spacing", NSW)
            if spacing is None:
                spacing = ET.SubElement(ppr, f"{{{W}}}spacing")
            spacing.set(f"{{{W}}}before", "0")
            spacing.set(f"{{{W}}}after", "0")
            spacing.set(f"{{{W}}}line", "220")
            spacing.set(f"{{{W}}}lineRule", "auto")
        for run in plan_tbl.findall(".//w:r", NSW):
            rpr = run.find("w:rPr", NSW)
            if rpr is None:
                rpr = ET.Element(f"{{{W}}}rPr")
                run.insert(0, rpr)
            for tag in ("sz", "szCs"):
                node = rpr.find(f"w:{tag}", NSW)
                if node is None:
                    node = ET.SubElement(rpr, f"{{{W}}}{tag}")
                node.set(f"{{{W}}}val", "18")
        tree.write(doc_path, encoding="UTF-8", xml_declaration=True)
        for header_path in (root_dir / "word").glob("header*.xml"):
            header_tree = ET.parse(header_path)
            header_root = header_tree.getroot()
            for node in header_root.findall(".//w:t", NSW):
                if node.text and "机器人整机" in node.text:
                    node.text = node.text.replace("机器人整机", "推理式协作臂")
            header_tree.write(header_path, encoding="UTF-8", xml_declaration=True)
        with ZipFile(DOCX_OUT, "w", ZIP_DEFLATED) as z:
            for f in sorted(root_dir.rglob("*")):
                if f.is_file(): z.write(f, f.relative_to(root_dir))


M = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
ET.register_namespace("", M)
MC = "http://schemas.openxmlformats.org/markup-compatibility/2006"
X14AC = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
XR = "http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ET.register_namespace("mc", MC)
ET.register_namespace("x14ac", X14AC)
ET.register_namespace("xr", XR)
ET.register_namespace("r", R)
NSM = {"m": M}


def set_xlsx_cell(sheet_root, ref, shared_root, text):
    cell = sheet_root.find(f".//m:c[@r='{ref}']", NSM)
    if cell is None:
        raise KeyError(ref)
    # Use the workbook's shared-string table instead of inline strings.  This
    # is supported consistently by Excel, WPS and LibreOffice.
    string_index = len(shared_root.findall("m:si", NSM))
    si = ET.SubElement(shared_root, f"{{{M}}}si")
    shared_t = ET.SubElement(si, f"{{{M}}}t")
    shared_t.text = text
    cell.set("t", "s")
    for ch in list(cell):
        if ch.tag in (f"{{{M}}}v", f"{{{M}}}is"):
            cell.remove(ch)
    value = ET.SubElement(cell, f"{{{M}}}v")
    value.text = str(string_index)


def build_xlsx():
    with TemporaryDirectory(prefix="reasoning-arm-xlsx-") as td:
        root_dir = Path(td)
        with ZipFile(XLSX_REF) as z:
            z.extractall(root_dir)
        sheet_path = root_dir / "xl" / "worksheets" / "sheet1.xml"
        strings_path = root_dir / "xl" / "sharedStrings.xml"
        tree = ET.parse(sheet_path)
        root = tree.getroot()
        strings_tree = ET.parse(strings_path)
        strings_root = strings_tree.getroot()
        # ElementTree drops unused namespace declarations.  The source sheet's
        # mc:Ignorable value also listed xr2/xr3, which then became unbound and
        # made Excel/WPS treat the worksheet as damaged.  Keep only prefixes
        # that remain declared in the serialized worksheet.
        ignorable = f"{{{MC}}}Ignorable"
        if ignorable in root.attrib:
            root.set(ignorable, "x14ac xr")
        values = {
            "C2": "推理式协作臂",
            "F2": "2026.10.28",
            "C3": "曾贤",
            "F3": "敏智整机研发部",
            "C4": "见《市场机会调研报告-推理式协作臂》PPT附件",
            "C5": "开发七轴推理式协作臂及运动控制器，由协作臂本体、运动控制器、推理模块、全局相机、末端相机和末端六维力传感器构成。首代产品采用敏实自研谐波关节电机和ROS 2 / MoveIt，后续升级为力位混合控制、灵巧手及产线级一对多推理服务器。",
            "C6": "关键技术包括七轴运动学与动力学控制、多相机和六维力融合、关节角/视频/力觉数据同步、GR00T场景模型后训练与端侧部署、推理动作安全约束、失败识别与自主纠正。主要卡点是关节电机可靠性、推理节拍与成功率、工业安全及跨芯片生态适配。",
            "C7": "集团拥有大量KUKA、安川、新松六轴机械臂、真实工业场景和数据采集条件，并具备自研关节电机与机器人零部件制造能力。可先参与内部BU自动化项目，再向技术中心销售产品，成熟后对外销售协作臂和推理式运动控制器。力位混合路线可形成差异化。",
            "C8": "2026年研发支出预计20万元；2027年Q1预计15万元，Q2预计50万元，Q4预计50万元，Q3小批量10套支出待核算。收入来源依次为内部POC项目（约30万元/项）、内部技术中心采购（目标3套以上、15万元/套）及后续产品销售。",
        }
        for ref, text in values.items(): set_xlsx_cell(root, ref, strings_root, text)
        # Drop no-longer-referenced strings (including the former applicant)
        # and remap indexes so stale personal data is not retained in the file.
        string_cells = [c for c in root.findall(".//m:c", NSM) if c.get("t") == "s"]
        used_indexes = sorted({int(c.find("m:v", NSM).text) for c in string_cells})
        index_map = {old: new for new, old in enumerate(used_indexes)}
        all_strings = strings_root.findall("m:si", NSM)
        for si in all_strings:
            strings_root.remove(si)
        for old in used_indexes:
            strings_root.append(all_strings[old])
        for cell in string_cells:
            value = cell.find("m:v", NSM)
            value.text = str(index_map[int(value.text)])
        strings_root.set("count", str(len(string_cells)))
        strings_root.set("uniqueCount", str(len(used_indexes)))
        sheet_pr = root.find("m:sheetPr", NSM)
        if sheet_pr is None:
            sheet_pr = ET.Element(f"{{{M}}}sheetPr")
            root.insert(0, sheet_pr)
        page_setup_pr = sheet_pr.find("m:pageSetUpPr", NSM)
        if page_setup_pr is None:
            page_setup_pr = ET.SubElement(sheet_pr, f"{{{M}}}pageSetUpPr")
        page_setup_pr.set("fitToPage", "1")
        page_setup = root.find("m:pageSetup", NSM)
        if page_setup is not None:
            page_setup.set("fitToWidth", "1")
            page_setup.set("fitToHeight", "1")
            page_setup.set("orientation", "landscape")
            page_setup.set("paperSize", "9")
        tree.write(sheet_path, encoding="UTF-8", xml_declaration=True)
        strings_tree.write(strings_path, encoding="UTF-8", xml_declaration=True)
        with ZipFile(XLSX_OUT, "w", ZIP_DEFLATED) as z:
            for f in sorted(root_dir.rglob("*")):
                if f.is_file(): z.write(f, f.relative_to(root_dir))


if __name__ == "__main__":
    build_pptx()
    build_docx()
    build_xlsx()
    print(PPT_OUT)
    print(DOCX_OUT)
    print(XLSX_OUT)
