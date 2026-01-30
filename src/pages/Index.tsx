import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [normalize, setNormalize] = useState([0]);

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
      </main>

      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 VoiceStudio Pro. Профессиональная обработка голоса</p>
        </div>
      </footer>
    </div>
  );
}
