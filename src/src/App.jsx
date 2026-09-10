import React, { useState, useEffect } from "react";
import { 
  Heart, MessageCircle, Plus, Copy, Check, 
  Send, Sparkles, ArrowRight, ShieldCheck 
} from "lucide-react";

export default function FatihaOnline() {
  const [activeTab, setActiveTab] = useState("fatiha");
  const [globalCount, setGlobalCount] = useState(() => {
    return parseInt(localStorage.getItem("fatiha_count") || "1404");
  });
  const [copied, setCopied] = useState(false);
  
  const [memorials, setMemorials] = useState(() => {
    const saved = localStorage.getItem("memorials_data");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "shohada-amameh",
        name: "شهدای والامقام روستای امامه",
        title: "۸۳ کبوتر خونین‌بال دفاع مقدس",
        date: "شهدای انقلاب و جنگ تحمیلی",
        bio: "صفحه یادبود اختصاصی شهدای والامقام روستای امامه به همت هیئت مجاهدین حسینی شهدای امامه جهت نثار فاتحه و صلوات.",
        fatihaCount: 830,
        messages: ["روح پاکتان با سیدالشهدا (ع) محشور باد.", "شادی ارواح طیبه شهدای امامه صلوات."]
      }
    ];
  });

  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newDate, setNewDate] = useState("");
  const [condolenceText, setCondolenceText] = useState("");

  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "سلام و درود. به سامانه فاتحه آنلاین خوش آمدید. برای اهدای ثواب قرائت قرآن، تسکین بازماندگان یا ادعیه در خدمت شما هستم." }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("fatiha_count", globalCount.toString());
  }, [globalCount]);

  useEffect(() => {
    localStorage.setItem("memorials_data", JSON.stringify(memorials));
  }, [memorials]);

  const handleIncrementFatiha = (memorialId = null) => {
    setGlobalCount(prev => prev + 1);
    if (memorialId) {
      setMemorials(prev => prev.map(m => m.id === memorialId ? { ...m, fatihaCount: m.fatihaCount + 1 } : m));
      if (selectedMemorial && selectedMemorial.id === memorialId) {
        setSelectedMemorial(prev => ({ ...prev, fatihaCount: prev.fatihaCount + 1 }));
      }
    }
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText("0267377983105859");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateMemorial = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newEntry = {
      id: "mem_" + Date.now(),
      name: newName.trim(),
      title: newTitle.trim() || "مرحوم مغفور",
      bio: newBio.trim() || "شادی روح این عزیز از دست رفته فاتحه و صلواتی قرائت فرمایید.",
      date: newDate.trim() || "۱۴۰۳",
      fatihaCount: 0,
      messages: []
    };
    setMemorials([newEntry, ...memorials]);
    setShowNewModal(false);
    setNewName("");
    setNewTitle("");
    setNewBio("");
    setNewDate("");
    setSelectedMemorial(newEntry);
  };

  const handleAddCondolence = (memorialId) => {
    if (!condolenceText.trim()) return;
    const updated = memorials.map(m => {
      if (m.id === memorialId) {
        return { ...m, messages: [condolenceText.trim(), ...m.messages] };
      }
      return m;
    });
    setMemorials(updated);
    if (selectedMemorial) {
      setSelectedMemorial(prev => ({ ...prev, messages: [condolenceText.trim(), ...prev.messages] }));
    }
    setCondolenceText("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg.trim();
    const newChat = [...chatMessages, { role: "user", text: userText }];
    setChatMessages(newChat);
    setInputMsg("");

    setTimeout(() => {
      let reply = "خداوند روح همه درگذشتگان را غریق رحمت کند. نثار فاتحه و صلوات نوری در عالم برزخ برای رفتگان است.";
      if (userText.includes("ثواب") || userText.includes("فاتحه")) {
        reply = "قرائت سوره مبارکه حمد برابر با یک سوم قرآن کریم ثواب داشته و مایه آرامش و آمرزش درگذشتگان است.";
      } else if (userText.includes("صبر") || userText.includes("غم")) {
        reply = "«الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ». خداوند به بازماندگان صبری جزیل و اجری عظیم عنایت فرماید.";
      } else if (userText.includes("هیئت") || userText.includes("امامه")) {
        reply = "این سامانه توسط عاشقان اهل‌بیت در هیئت مجاهدین حسینی شهدای امامه راه‌اندازی شده است.";
      }
      setChatMessages([...newChat, { role: "bot", text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1c2e24] font-sans flex flex-col" dir="rtl">
      <header className="bg-[#143e27] text-[#fbf8ee] border-b border-[#1f5938] shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">فاتحه آنلاین</h1>
              <p className="text-xs text-[#a7d4ba]">هیئت مجاهدین حسینی شهدای امامه</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#0c2919] px-3 py-1.5 rounded-full border border-[#235e3d] text-xs">
            <Heart className="w-3.5 h-3.5 text-[#e5b358] fill-[#e5b358]" />
            <span>کل فاتحه‌ها:</span>
            <span className="font-bold text-[#e5b358]">{globalCount.toLocaleString("fa-IR")}</span>
          </div>
        </div>
      </header>

      <nav className="bg-[#f2ecdd] border-b border-[#dfd7c2] sticky top-[57px] z-20">
        <div className="max-w-4xl mx-auto px-4 flex gap-2 overflow-x-auto py-2 text-sm font-medium">
          <button 
            onClick={() => { setActiveTab("fatiha"); setSelectedMemorial(null); }}
            className={`px-4 py-1.5 rounded-lg transition ${activeTab === "fatiha" && !selectedMemorial ? "bg-[#143e27] text-white shadow" : "text-[#344d3f] hover:bg-[#e4dcce]"}`}
          >
            📖 قرائت فاتحه و اخلاص
          </button>
          <button 
            onClick={() => setActiveTab("memorials")}
            className={`px-4 py-1.5 rounded-lg transition ${activeTab === "memorials" || selectedMemorial ? "bg-[#143e27] text-white shadow" : "text-[#344d3f] hover:bg-[#e4dcce]"}`}
          >
            🕊️ صفحات یادبود
          </button>
          <button 
            onClick={() => { setActiveTab("bot"); setSelectedMemorial(null); }}
            className={`px-4 py-1.5 rounded-lg transition ${activeTab === "bot" ? "bg-[#143e27] text-white shadow" : "text-[#344d3f] hover:bg-[#e4dcce]"}`}
          >
            💬 همدم تسلیت (ربات)
          </button>
          <button 
            onClick={() => { setActiveTab("support"); setSelectedMemorial(null); }}
            className={`px-4 py-1.5 rounded-lg transition ${activeTab === "support" ? "bg-[#143e27] text-white shadow" : "text-[#344d3f] hover:bg-[#e4dcce]"}`}
          >
            💚 حمایت از هیئت
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto w-full px-4 py-6 flex-1">
        {activeTab === "fatiha" && !selectedMemorial && (
          <div className="space-y-6">
            <div className="bg-[#f6f2e8] border border-[#dcd2be] rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <p className="text-[#846b32] font-semibold text-sm mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <h2 className="text-xl font-bold text-[#143e27] mb-6">سوره مبارکه فاتحة الکتاب</h2>

              <div className="space-y-3 text-base md:text-lg leading-relaxed text-[#21352a] font-serif bg-white/70 p-5 rounded-xl border border-[#ece4d4]">
                <p>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿۱﴾</p>
                <p>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿۲﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿۳﴾</p>
                <p>مَالِكِ يَوْمِ الدِّينِ ﴿۴﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿۵﴾</p>
                <p>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿۶﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿۷﴾</p>
              </div>

              <div className="my-6 border-t border-[#dfd5bf] pt-4">
                <h3 className="text-lg font-bold text-[#143e27] mb-3">سوره مبارکه توحید (اخلاص)</h3>
                <div className="space-y-2 text-base md:text-lg text-[#21352a] font-serif bg-white/70 p-4 rounded-xl border border-[#ece4d4]">
                  <p>قُلْ هُوَ اللَّهُ أَحَدٌ ﴿۱﴾ اللَّهُ الصَّمَدُ ﴿۲﴾</p>
                  <p>لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿۳﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿۴﴾</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleIncrementFatiha()}
                  className="bg-[#143e27] hover:bg-[#1a4f32] active:scale-95 text-[#fbf8ee] px-8 py-3 rounded-full font-bold text-base shadow-lg transition flex items-center gap-2 mx-auto"
                >
                  <Heart className="w-5 h-5 fill-[#e5b358] text-[#e5b358]" />
                  <span>قرائت کردم (نثار فاتحه و صلوات)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "memorials" || selectedMemorial) && (
          <div>
            {!selectedMemorial ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#f4efe3] p-4 rounded-xl border border-[#ded5c1]">
                  <div>
                    <h2 className="font-bold text-[#143e27] text-lg">صفحات یادبود درگذشتگان</h2>
                    <p className="text-xs text-[#5f7468]">صفحه‌ای جاودان برای نثار فاتحه و ثبت تسلیت بسازید.</p>
                  </div>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="bg-[#143e27] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow hover:bg-[#1b5033] transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ایجاد یادبود</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memorials.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedMemorial(item)}
                      className="bg-white border border-[#e6dece] rounded-xl p-5 hover:border-[#143e27] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-[#8a7238] bg-[#f8f4ea] px-2 py-0.5 rounded-md border border-[#e8dfcf]">
                              {item.title}
                            </span>
                            <h3 className="font-bold text-[#143e27] text-lg mt-1.5">{item.name}</h3>
                          </div>
                          <div className="text-xs font-bold text-[#143e27] bg-[#eef6f1] px-2.5 py-1 rounded-full border border-[#c3dfce]">
                            {item.fatihaCount} فاتحه
                          </div>
                        </div>
                        <p className="text-xs text-[#687a70] mt-2 line-clamp-2">{item.bio}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#f0eade] flex justify-between items-center text-xs text-[#7f8f86]">
                        <span>تاریخ: {item.date}</span>
                        <span className="text-[#143e27] font-medium flex items-center gap-1">
                          ورود به صفحه <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedMemorial(null)}
                  className="text-xs font-bold text-[#143e27] flex items-center gap-1 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به فهرست همه یادبودها</span>
                </button>

                <div className="bg-[#f6f2e8] border border-[#dcd2be] rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-[#143e27] text-[#fbf8ee] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow">
                    {selectedMemorial.name.charAt(0)}
                  </div>
                  <span className="text-xs bg-[#eadeca] text-[#715923] px-3 py-1 rounded-full font-medium">
                    {selectedMemorial.title}
                  </span>
                  <h2 className="text-2xl font-bold text-[#143e27] mt-2">{selectedMemorial.name}</h2>
                  <p className="text-xs text-[#6b7b72] mt-1">{selectedMemorial.date}</p>
                  <p className="text-sm text-[#384a40] max-w-lg mx-auto mt-4 leading-relaxed bg-white/70 p-4 rounded-xl border border-[#e8dfcf]">
                    {selectedMemorial.bio}
                  </p>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => handleIncrementFatiha(selectedMemorial.id)}
                      className="bg-[#143e27] hover:bg-[#1a4f32] active:scale-95 text-[#fbf8ee] px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-[#e5b358] text-[#e5b358]" />
                      <span>نثار فاتحه برای این عزیز ({selectedMemorial.fatihaCount})</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[#e6dece] rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-[#143e27] text-base mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#8a7238]" />
                    <span>دفترچه پیام‌های تسلیت</span>
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="پیام تسلیت یا طلب مغفرت خود را بنویسید..."
                      value={condolenceText}
                      onChange={(e) => setCondolenceText(e.target.value)}
                      className="flex-1 text-sm bg-[#faf8f2] border border-[#d8cfbe] rounded-lg px-3 py-2 outline-none focus:border-[#143e27]"
                    />
                    <button
                      onClick={() => handleAddCondolence(selectedMemorial.id)}
                      className="bg-[#143e27] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1b5033]"
                    >
                      ارسال
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedMemorial.messages && selectedMemorial.messages.length > 0 ? (
                      selectedMemorial.messages.map((msg, idx) => (
                        <div key={idx} className="bg-[#faf8f3] border-r-4 border-[#143e27] p-3 rounded-lg text-xs text-[#2c3f35]">
                          {msg}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#8f9e96] text-center py-3">اولین پیام تسلیت را ثبت کنید.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bot" && (
          <div className="bg-white border border-[#e6dece] rounded-2xl shadow-sm flex flex-col h-[480px]">
            <div className="bg-[#f6f2e8] p-4 border-b border-[#dfd6c3] rounded-t-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8a7238]" />
              <div>
                <h3 className="font-bold text-[#143e27] text-sm">همدم تسلیت و یادبود</h3>
                <p className="text-xs text-[#6e7f76]">پاسخ به سوالات درباره ثواب فاتحه و ادعیه</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((item, idx) => (
                <div key={idx} className={`flex ${item.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] text-xs md:text-sm p-3 rounded-2xl leading-relaxed ${
                    item.role === "user" 
                      ? "bg-[#143e27] text-white rounded-tr-none" 
                      : "bg-[#f5efe4] text-[#203328] border border-[#e4dbca] rounded-tl-none"
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#eee7da] bg-[#faf8f4] rounded-b-2xl flex gap-2">
              <input
                type="text"
                placeholder="پیام خود را بنویسید (مثلاً: ثواب فاتحه چیست؟)"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 text-sm bg-white border border-[#d9cfbd] rounded-xl px-3 py-2 outline-none focus:border-[#143e27]"
              />
              <button
                type="submit"
                className="bg-[#143e27] text-white p-2.5 rounded-xl hover:bg-[#1a4f32] transition"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="bg-[#f6f2e8] border border-[#dfd5bf] rounded-2xl p-6 shadow-sm text-center">
              <ShieldCheck className="w-12 h-12 text-[#143e27] mx-auto mb-3" />
              <h2 className="text-xl font-bold text-[#143e27] mb-2">حمایت مالی از هیئت مجاهدین حسینی شهدای امامه</h2>
              <p className="text-sm text-[#4c5f54] max-w-md mx-auto leading-relaxed">
                تمامی خدمات این سامانه رایگان و عام‌المنفعه است. نذورات واریزی شما صرف امور فرهنگی و خیریه هیئت خواهد شد.
              </p>

              <div className="mt-6 bg-white border-2 border-dashed border-[#143e27] rounded-xl p-5 max-w-md mx-auto text-right">
                <div className="text-xs text-[#73847a] mb-1">شماره کارت هیئت:</div>
                <div className="flex items-center justify-between gap-2 bg-[#f9f7f2] p-3 rounded-lg border border-[#e6ddce]">
                  <span className="font-mono text-base md:text-lg font-bold text-[#143e27] tracking-wider">
                    ۰۲۶۷ - ۳۷۷۹ - ۸۳۱۰ - ۵۸۵۹
                  </span>
                  <button
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 text-xs bg-[#143e27] text-white px-2.5 py-1.5 rounded-md hover:bg-[#1f5a39] transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "کپی شد" : "کپی"}</span>
                  </button>
                </div>
                <div className="mt-3 text-xs text-[#415549] flex justify-between">
                  <span>به نام:</span>
                  <span className="font-bold text-[#143e27]">حسن ورزاوند</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ded5c2]" dir="rtl">
            <h3 className="text-lg font-bold text-[#143e27] mb-4">ایجاد صفحه یادبود جدید</h3>
            <form onSubmit={handleCreateMemorial} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#485c51] mb-1">نام و نام‌خانوادگی مرحوم / شهید *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: شادروان علی رضایی"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#d6ccb9] rounded-lg p-2.5 outline-none focus:border-[#143e27]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#485c51] mb-1">عنوان یادبود</label>
                <input
                  type="text"
                  placeholder="مثال: پدر دلسوز، مادر فداکار"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#d6ccb9] rounded-lg p-2.5 outline-none focus:border-[#143e27]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#485c51] mb-1">تاریخ وفات / شهادت</label>
                <input
                  type="text"
                  placeholder="مثال: بهمن ۱۴۰۲"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#d6ccb9] rounded-lg p-2.5 outline-none focus:border-[#143e27]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#485c51] mb-1">دلنوشته یا زندگینامه کوتاه</label>
                <textarea
                  rows="3"
                  placeholder="توضیحی کوتاه جهت طلب مغفرت..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#d6ccb9] rounded-lg p-2.5 outline-none focus:border-[#143e27]"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#143e27] text-white py-2.5 rounded-lg font-bold hover:bg-[#1a5033]"
                >
                  ثبت یادبود
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#d6ccb9] text-[#55695e] hover:bg-[#f2ece0]"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#103320] text-[#ded3bd] border-t border-[#1a4f32] mt-10 py-6 text-center text-xs space-y-1.5">
        <p className="font-bold text-sm text-[#f4efe3]">فاتحه آنلاین</p>
        <p className="text-[#a7d4ba]">ساخته‌شده توسط هیئت مجاهدین حسینی شهدای امامه</p>
      </footer>
    </div>
  );
}
