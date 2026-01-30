import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Recording = {
  id: string;
  name: string;
  duration: string;
  size: string;
  date: string;
  selected: boolean;
};

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [normalize, setNormalize] = useState([0]);
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: '1', name: 'Запись диктора 1.wav', duration: '00:03:45', size: '2.4 MB', date: '30.01.2024', selected: false },
    { id: '2', name: 'Озвучка проект А.wav', duration: '00:05:12', size: '3.8 MB', date: '30.01.2024', selected: false },
    { id: '3', name: 'Диктор рекламный ролик.wav', duration: '00:01:30', size: '1.2 MB', date: '29.01.2024', selected: false },
    { id: '4', name: 'Подкаст эпизод 5.wav', duration: '00:12:45', size: '9.1 MB', date: '29.01.2024', selected: false },
  ]);
  const [convertFormat, setConvertFormat] = useState('mp3');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleRecording = (id: string) => {
    setRecordings(prev => prev.map(rec => 
      rec.id === id ? { ...rec, selected: !rec.selected } : rec
    ));
  };

  const toggleAll = () => {
    const allSelected = recordings.every(rec => rec.selected);
    setRecordings(prev => prev.map(rec => ({ ...rec, selected: !allSelected })));
  };

  const selectedCount = recordings.filter(rec => rec.selected).length;

  const handleDownload = async (format: string) => {
    const selected = recordings.filter(rec => rec.selected);
    if (selected.length === 0) {
      toast.error('Выберите файлы для скачивания');
      return;
    }
    
    const toastId = toast.loading(`Конвертация ${selected.length} файлов в ${format.toUpperCase()}...`);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6cc407c4-fb9a-4358-9271-001178e619ff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: selected.map(rec => ({ name: rec.name })),
          format: format
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Конвертировано ${data.totalConverted} файлов в ${format.toUpperCase()}`, { id: toastId });
      } else {
        toast.error('Ошибка конвертации', { id: toastId });
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу', { id: toastId });
    }
  };

  const handleBatchProcess = async () => {
    const selected = recordings.filter(rec => rec.selected);
    if (selected.length === 0) {
      toast.error('Выберите файлы для обработки');
      return;
    }
    
    setIsProcessing(true);
    const toastId = toast.loading(`Обработка ${selected.length} записей...`);
    
    try {
      const response = await fetch('https://functions.poehali.dev/e11d56fc-d15e-41f0-a991-cdba9cf432f9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: selected.map(rec => ({ name: rec.name })),
          options: {
            normalize: true,
            noiseReduction: true,
            compression: true,
            trimSilence: true
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        let message = `Обработано ${data.totalProcessed} файлов:\n`;
        data.results.forEach((result: any) => {
          const change = result.stats.loudnessChange;
          message += `\n${result.filename}: ${change > 0 ? '+' : ''}${change} dB`;
        });
        toast.success(message, { id: toastId, duration: 5000 });
      } else {
        toast.error('Ошибка обработки', { id: toastId });
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-secondary text-secondary-foreground border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Mic2" className="text-primary" size={28} />
              <h1 className="text-xl font-semibold">VoiceStudio Pro</h1>
            </div>
            <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-secondary-foreground/70 hover:text-secondary-foreground'}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActiveTab('record')}
                className={`text-sm font-medium transition-colors ${activeTab === 'record' ? 'text-primary' : 'text-secondary-foreground/70 hover:text-secondary-foreground'}`}
              >
                Запись
              </button>
              <button 
                onClick={() => setActiveTab('process')}
                className={`text-sm font-medium transition-colors ${activeTab === 'process' ? 'text-primary' : 'text-secondary-foreground/70 hover:text-secondary-foreground'}`}
              >
                Обработка
              </button>
              <button 
                onClick={() => setActiveTab('library')}
                className={`text-sm font-medium transition-colors ${activeTab === 'library' ? 'text-primary' : 'text-secondary-foreground/70 hover:text-secondary-foreground'}`}
              >
                Библиотека
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 text-foreground">
                Профессиональная студия для записи голоса
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Записывайте и обрабатывайте аудио с качеством профессиональной студии прямо в браузере
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setActiveTab('record')}
              >
                <Icon name="Play" size={20} className="mr-2" />
                Начать запись
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mic" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Запись в реальном времени</h3>
                <p className="text-muted-foreground">
                  Высококачественная запись голоса с визуализацией звуковой волны
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Sliders" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Автоматическая нормализация</h3>
                <p className="text-muted-foreground">
                  Выравнивание громкости для единого уровня звука по всей записи
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Wand2" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Профессиональная обработка</h3>
                <p className="text-muted-foreground">
                  Инструменты шумоподавления и улучшения качества голоса
                </p>
              </Card>
            </div>

            <div className="bg-secondary text-secondary-foreground rounded-lg p-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">Доверие профессионалов</h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                VoiceStudio Pro используют дикторы, подкастеры и звукорежиссёры для создания контента студийного качества
              </p>
            </div>
          </div>
        )}

        {activeTab === 'record' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Студия записи</h2>
            
            <Card className="p-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-muted rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                  <div className="flex items-end gap-1 h-32">
                    {[...Array(50)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-primary rounded-full transition-all duration-150 ${
                          isRecording ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: isRecording 
                            ? `${Math.random() * 100 + 20}%` 
                            : '4px',
                          opacity: isRecording ? 0.7 + Math.random() * 0.3 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={() => setIsRecording(!isRecording)}
                    className="w-32"
                  >
                    <Icon 
                      name={isRecording ? "Square" : "Mic"} 
                      size={20} 
                      className="mr-2" 
                    />
                    {isRecording ? 'Стоп' : 'Запись'}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Icon name="Pause" size={20} className="mr-2" />
                    Пауза
                  </Button>
                  <Button size="lg" variant="outline">
                    <Icon name="Play" size={20} className="mr-2" />
                    Прослушать
                  </Button>
                </div>

                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Уровень входа</label>
                    <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                  </div>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Settings" size={20} className="mr-2 text-primary" />
                  Параметры записи
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Качество</span>
                    <span className="font-medium">48 kHz / 24 bit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Формат</span>
                    <span className="font-medium">WAV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Каналы</span>
                    <span className="font-medium">Mono</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Clock" size={20} className="mr-2 text-accent" />
                  Статус записи
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Длительность</span>
                    <span className="font-medium">00:00:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Размер файла</span>
                    <span className="font-medium">0 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Статус</span>
                    <span className={`font-medium ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {isRecording ? 'Идёт запись' : 'Готов к записи'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Обработка аудио</h2>
            
            <Card className="p-8 mb-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Загруженный файл</h3>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileAudio" size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">recording_voice.wav</p>
                      <p className="text-sm text-muted-foreground">2.4 MB • 00:03:45</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Выбрать файл
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold flex items-center">
                      <Icon name="Volume2" size={18} className="mr-2 text-accent" />
                      Нормализация громкости
                    </label>
                    <span className="text-sm text-muted-foreground">{normalize[0]} dB</span>
                  </div>
                  <Slider
                    value={normalize}
                    onValueChange={setNormalize}
                    min={-20}
                    max={20}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Автоматическое выравнивание уровня громкости для единого звучания
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="AudioWaveform" size={20} className="text-primary" />
                      <span className="font-medium">Шумоподавление</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Удаление фонового шума
                    </span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Sparkles" size={20} className="text-accent" />
                      <span className="font-medium">Улучшение голоса</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Повышение чёткости речи
                    </span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Scissors" size={20} className="text-primary" />
                      <span className="font-medium">Обрезка тишины</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Удаление пауз в начале и конце
                    </span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Waves" size={20} className="text-accent" />
                      <span className="font-medium">Эквалайзер</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Настройка частот
                    </span>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button size="lg" className="w-full">
                    <Icon name="Wand2" size={20} className="mr-2" />
                    Применить обработку
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Icon name="Info" size={20} className="mr-2 text-primary" />
                Результат обработки
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                После применения обработки здесь появится информация о результате и кнопки для скачивания файла
              </p>
              <div className="flex gap-3">
                <Button variant="outline" disabled>
                  <Icon name="Download" size={16} className="mr-2" />
                  Скачать WAV
                </Button>
                <Button variant="outline" disabled>
                  <Icon name="Download" size={16} className="mr-2" />
                  Скачать MP3
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Библиотека записей</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Icon name="Upload" size={18} className="mr-2" />
                  Загрузить файлы
                </Button>
              </div>
            </div>

            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={recordings.every(rec => rec.selected)}
                      onCheckedChange={toggleAll}
                    />
                    <span className="text-sm font-medium">
                      {selectedCount > 0 ? `Выбрано: ${selectedCount}` : 'Выбрать все'}
                    </span>
                  </div>
                </div>

                {selectedCount > 0 && (
                  <div className="flex items-center gap-3">
                    <Select value={convertFormat} onValueChange={setConvertFormat}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="aac">AAC</SelectItem>
                        <SelectItem value="flac">FLAC</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownload(convertFormat)}
                    >
                      <Icon name="Download" size={18} className="mr-2" />
                      Скачать ({convertFormat.toUpperCase()})
                    </Button>

                    <Button 
                      onClick={handleBatchProcess}
                      disabled={isProcessing}
                    >
                      <Icon name="Wand2" size={18} className="mr-2" />
                      Обработать все
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {recordings.map((rec) => (
                  <div 
                    key={rec.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      rec.selected ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={rec.selected}
                        onCheckedChange={() => toggleRecording(rec.id)}
                      />
                      
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="FileAudio" size={24} className="text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{rec.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {rec.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" size={14} />
                            {rec.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {rec.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Icon name="Play" size={16} className="mr-1" />
                          Слушать
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Download" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-muted/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{recordings.length}</div>
                  <p className="text-sm text-muted-foreground">Всего записей</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {recordings.reduce((acc, rec) => acc + parseFloat(rec.size), 0).toFixed(1)} MB
                  </div>
                  <p className="text-sm text-muted-foreground">Общий размер</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{selectedCount}</div>
                  <p className="text-sm text-muted-foreground">Выбрано файлов</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 VoiceStudio Pro. Профессиональная обработка голоса</p>
        </div>
      </footer>
    </div>
  );
}